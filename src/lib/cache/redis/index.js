import EventEmitter from "events";
import Redis from "redis";
import { isNullOrUndefined } from "../../validators/index";
/**
 * Established on Redis connection
 * @param {*} identifier
 * @param {*} host
 * @param {*} port
 * @param {*} options
 * @param {*} logger
 */
export default function connect(identifier, host, port, options, logger) {
  return new Promise((resolve, reject) => {
    const cacheProvider = new CacheProvider(
      identifier,
      host,
      port,
      options,
      logger
    );
    const connectionErrorHandler = () => {
        cacheProvider.removeListener("ready", connectReadyHandler);
        reject(new Error("An error occurred while connecting"));
      },
      connectionReadyHandler = () => {
        cacheProvider.removeListener("error", connectionErrorHandler);
        resolve(cacheProvider);
      };
    cacheProvider.once("ready", connectionReadyHandler);
    cacheProvider.once("error", connectionErrorHandler);
    cacheProvider.connect();
  });
}
/**
 * Redis cache provider
 */
export class CacheProvider extends EventEmitter {
  constructor(identifier, host, port, options, logger, logLabel = "cache") {
    super();
    this._identifier = identifier;
    this._host = host;
    this._port = port;
    this._options = options;
    this._logger = logger;
    this._logLabel = logLabel;

    this._redisClient = null;
    this._isConnected = false;
    this._isReady = false;
    this._stores = new Map();
  }
  get isConnected() {
    return this._isConnected;
  }
  get isReady() {
    return this._isReady;
  }
  get Stores() {
    return this._stores;
  }
  get RedisClient() {
    return this._redisClient;
  }
  /**
   * Attempts to connect the redis instance
   */
  connect() {
    this._redisClient = Redis.createClient(
      this._port,
      this._host,
      this._options
    );
    this._redisClient.on("ready", this._onClientReady.bind(this));
    this._redisClient.on("connect", this._onClientConnect.bind(this));
    this._redisClient.on("reconnecting", this._onClientReconnecting.bind(this));
    this._redisClient.on("error", this._onClientError.bind(this));
    this._redisClient.on("end", this._onClientEnd.bind(this));
  }

  close() {
    if (this._redisClient) {
      this._redisClient.quit((error, result) => {
        if (error) {
          this._logger.log({
            level: "error",
            label: this._logLabel,
            message: "An error occurred while closing cache provider",
            error,
          });
        } else {
          this._logger.log({
            level: "info",
            label: this._logLabel,
            message: "provider successfully closed",
            data: result,
          });
        }
      });
    }
  }
  /**
   * Create the cache store.if a store with same name already exists,its return the existing instance else new.
   * @param {*} storeName
   * @param {*} cachePolicy
   */
  createStore(storeName, cachePolicy = { expire: 3600 }) {
    const storeIdentifier = `urn:${this._identifier}:${storeName}`;
    if (this.Stores.has(storeIdentifier)) {
      return this.Stores.get(storeIdentifier);
    } else {
      const newStore = new CacheStore(
        this.RedisClient,
        storeIdentifier,
        cachePolicy,
        this._logger,
        this._logLabel
      );
      this.Stores.set(storeIdentifier, newStore);
      return newStore;
    }
  }
  _onClientReady() {
    this._isConnected = true;
    this._isReady = true;
    this._logger.log({
      level: "info",
      label: this._logLabel,
      message: "Provider is ready",
    });
    this.emit("ready", this._redisClient);
  }
  _onClientConnect() {
    this._isConnected = true;
    this._isReady = false;
    this._logger.log({
      level: "info",
      label: this._logLabel,
      message: "Provider connect to redis",
    });
    this.emit("connect", this._redisClient);
  }
  _onClientReconnecting({ delay, attempt, error }) {
    this._isConnected = false;
    this._isReady = false;
    this._logger.log({
      level: "error",
      label: this._logLabel,
      message: `Provider disconnected,Attempting to reconnect #${attempt} ${delay} ms.`,
      error,
    });
    this.emit("reconnecting", delay, attempt, error);
  }
  _onClientError() {
    this._isConnected = false;
    this._isReady = false;
    this._logger.log({
      level: "error",
      label: this._logLabel,
      message: "Provider encountered an error",
    });
    this.emit("error");
  }
  _onClientEnd() {
    this._isConnected = false;
    this._isReady = false;
    this._logger.log({
      level: "error",
      label: this._logLabel,
      message: `Provider closed connection with redis`,
    });
    this.emit("end");
  }
}
/**
 * A container for related to cache entries
 */
class CacheStore {
  constructor(redisClient, identifier, policy, logger, logLabel) {
    this._identifier = identifier;
    this._policy = policy;
    this._logger = logger;
    this._logLabel = logLabel;
    this._redisClient = redisClient;
  }

  get RedisClient() {
    return this._redisClient;
  }

  get identifier() {
    return this._identifier;
  }
  /**
   * Insert a cache entry into the cache
   * @param {} key
   * @param {*} value
   */
  set(key, value) {
    return new Promise((resolve, reject) => {
      const optionArgs = ["Ex", this._policy.expire];
      this.RedisClient.set(
        `${this.identifier}:${key}`,
        JSON.stringify(value),
        ...optionArgs,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.RedisClient.get(`${this.identifier}:${key}`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(result));
        }
      });
    });
  }

  exists(key) {
    return new Promise((resolve, reject) => {
      this.RedisClient.exists(`${this.identifier}:${key}`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result > 0);
        }
      });
    });
  }

  remove(key) {
    return new Promise((resolve, reject) => {
      this.RedisClient.del(`${this.identifier}:${key}`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  keys() {
    return new Promise((resolve, reject) => {
      this.RedisClient.keys(`${this.identifier}:*`, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      this.RedisClient.keys(`${this.identifier}:*`, (error, keys) => {
        if (error) {
          reject(error);
        } else {
          if (keys.length > 0) {
            this.RedisClient.del(keys, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          } else {
            resolve(0);
          }
        }
      });
    });
  }
}

export async function getFromCacheOrSource(cacheStore, key, getFromSource) {
  const cacheEntryExists = await cacheStore.exists(key);
  if (cacheEntryExists) {
    return await cacheStore.get(key);
  } else {
    const dataFromSource = await getFromSource(key);
    if (!isNullOrUndefined(dataFromSource)) {
      await cacheStore.set(key, dataFromSource);
    }
    return dataFromSource;
  }
}
