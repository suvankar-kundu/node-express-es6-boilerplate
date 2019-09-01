import BaseRouter from './baseRouter';
import { authenticated } from '../middleware/middleware-security';

class UserRouter extends BaseRouter {
  constructor (
    userRepository,
    userController
  ) {
    super(userController);
    //  this.Router.use(authenticated());

    this.Router.route('/')
      .post(async (req, res) => this.Controller.create(req, res));

    this.Router.route('/version')
      .get(async (req, res) => this.Controller.version(req, res));

    this.Router.route('/signin')
      .post(async (req, res) => this.Controller.signIn(req, res));
  }
}

export default UserRouter;