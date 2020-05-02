import BaseRouter from "./baseRouter";
/**
 * @swagger
 * /users:
 *    get:
 *      description: This should return all users
 */
class UserRouter extends BaseRouter {
  constructor(userController) {
    super(userController);
    this.Router.route("/")
      .post(async (req, res) => this.Controller.create(req, res))
      .get(async (req, res) => this.Controller.test(req, res));
  }
}

export default UserRouter;
