import { getFromCacheOrSource } from "../lib/cache/redis/index";
import jwt from "jsonwebtoken";
export class SecurityManager {
  constructor(
    roleRepository,
    roleCacheStore,
    privilegeRepository,
    privilegeCacheStore,
    jwtIssuer,
    jwtSecret
  ) {
    this._roleRepository = roleRepository;
    this._roleCacheStore = roleCacheStore;
    this._privilegeRepository = privilegeRepository;
    this._privilegeCacheStore = privilegeCacheStore;

    this._jwtIssuer = jwtIssuer;
    this._jwtSecret = jwtSecret;
    this._tokenStore = new Map();
  }

  get RoleRepository() {
    return this._roleRepository;
  }

  get RoleCacheStore() {
    return this._roleCacheStore;
  }
  get PrivilegeCacheStore() {
    return this._privilegeCacheStore;
  }

  get PrivilegeRepository() {
    return this._privilegeRepository;
  }
  get TokenLifeSpan() {
    return 60 * 60;
  }

  get Scheme() {
    return "JWT";
  }

  async userHasRole(user, role) {
    if (user.roles.length > 0) {
      const allRoles = await getFromCacheOrSource(
        this.RoleCacheStore,
        "all",
        () =>
          this.RoleRepository.get({
            _id: { $in: user.roles },
          })
      );
      return allRoles
        .filter(({ _id }) => user.roles.includes(_id))
        .some(({ _id }) => _id === role);
    } else {
      return false;
    }
  }

  async userHasPrivilege(user, privilege) {
    if (user.roles.length > 0) {
      const allRoles = await getFromCacheOrSource(
        this.RoleCacheStore,
        "all",
        () => this.RoleRepository.get({})
      );
      const userRoles = allRoles.filter(({ _id }) => user.roles.includes(_id));
      const userRolePrivileges = [].concat(
        ...userRoles.map(({ privileges }) => privileges)
      );
      if (userRolePrivileges.length > 0) {
        const allPrivileges = await getFromCacheOrSource(
          this.PrivilegeCacheStore,
          "all-active",
          () =>
            this.PrivilegeRepository.get({
              isActive: true,
            })
        );
        return allPrivileges
          .filter(({ _id }) => userRolePrivileges.includes(_id))
          .some(({ _id }) => _id === privilege);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async createToken(userId, audience, expiresIn, issuer) {
    return await this.create({ sub: userId, aud: audience }, this._jwtSecret, {
      algorithm: "HS256",
      expiresIn,
      issuer,
    });
  }

  async getToken(userId, audience) {
    const cacheKey = `${audience}:${userId}`;
    if (this._tokenStore.has(cacheKey)) {
      const { expiresIn, token } = this._tokenStore.get(cacheKey);
      //if token is valid for more than 10 minutes reuse it
      if (expiresIn - Date.now() > 600 * 1000) {
        return token;
      } else {
        const newToken = await this.createToken(
          userId,
          audience,
          this.TokenLifeSpan,
          this._jwtIssuer
        );
        this._tokenStore.set(cacheKey, {
          token: newToken,
          expiresIn: Date.now() + this.TokenLifeSpan * 1000,
        });
        return newToken;
      }
    } else {
      const newToken = await this.createToken(
        userId,
        audience,
        this.TokenLifeSpan,
        this._jwtIssuer
      );
      this._tokenStore.set(cacheKey, {
        token: newToken,
        expiresIn: Date.now() + this.TokenLifeSpan * 1000,
      });
      return newToken;
    }
  }
}

export function create(payload, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (error, encodedToken) => {
      if (error) {
        reject(error);
      } else {
        resolve(encodedToken);
      }
    });
  });
}
