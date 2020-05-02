import ApiController from "../../lib/api/controllers/index";

class UserController extends ApiController {
  constructor(userManager, logger) {
    super("App", logger);
    this._userManager = userManager;
    this._logger = logger;
  }

  get UserManager() {
    return this._userManager;
  }

  async create(req, res) {
    try {
      const newUser = await this.UserManager.createUser(req.body);
      this.httpCreated(
        res,
        Object.assign({}, newUser.toJSON(), { password: null })
      );
    } catch (error) {
      this.httpInternalServerError(res, error.message);
    }
  }
  async test(req, res) {
    this.httpOk(res, { message: "up" });
  }
}

export default UserController;
