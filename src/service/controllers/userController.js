import ApiController from './apiController';
import * as HttpStatus from '../../common/constants/httpStatus';
import { getToken } from '../middleware/middleware-passport';

class UserController extends ApiController {
  constructor (userRepository, logger) {
    super();
    this._userReposotory = userRepository;
  }

  get UserReposotory () {
    return this._userReposotory;
  }

  async create (req, res) {
    try {
      const newUser = await this.UserReposotory.create(req.body);
      res.status(HttpStatus.Created).json(Object.assign({}, newUser.toJSON(), { password: null }));
    } catch (error) {
      res.status(HttpStatus.InternalServerError).send(error.message);
    }
  }

  async signIn (req, res) {
    try {
      const user = await this.UserReposotory.getById(req.body.userName);
      if (user && (user.isActive === true) && (user.password === req.body.password)) {
        const token = getToken(user);
        res.status(HttpStatus.OK).json(Object.assign({}, user.toJSON(), { token, password: null }));
      } else {
        res.status(HttpStatus.NotFound).send('User not active/registered/wrong password');
      }
    } catch (error) {
      res.status(HttpStatus.InternalServerError).send(error.message);
    }
  }

  async version (req, res) {
    try {
      res.status(HttpStatus.Created).json('Api version 1');
    } catch (error) {
      res.status(HttpStatus.InternalServerError).send(error.message);
    }
  }
}

export default UserController;