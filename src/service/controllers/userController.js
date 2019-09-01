import ApiController from './apiController';
import { getToken } from '../middleware/middleware-passport';

class UserController extends ApiController {
  constructor(userRepository, logger) {
    super();
    this._userReposotory = userRepository;
  }

  get UserReposotory() {
    return this._userReposotory;
  }

  async create(req, res) {
    try {
      const newUser = await this.UserReposotory.create(req.body);
      this.httpCreated(res, Object.assign({}, newUser.toJSON(), { password: null }));
    } catch (error) {
      this.httpInternalServerError(res, error.message);
    }
  }

  async signIn(req, res) {
    try {
      const user = await this.UserReposotory.getById(req.body.userName);
      if (user && (user.isActive === true) && (user.password === req.body.password)) {
        const token = getToken(user);
        this.httpOk(res, Object.assign({}, user.toJSON(), { token, password: null }));
      } else {
        this.httpNotFound(res, 'User not active/registered/wrong password');
      }
    } catch (error) {
      this.httpInternalServerError(res, error.message);
    }
  }

  async version(req, res) {
    try {
      this.httpOk(res, 'Api version 1');
    } catch (error) {
      this.httpInternalServerError(res, error.message);
    }
  }
}

export default UserController;