import ApiController from "../../lib/api/controllers/index";

class UserController extends ApiController {
  constructor(userManager, logger, mysqlUserRepo) {
    super("App", logger);
    this._userManager = userManager;
    this._logger = logger;
    this._mysqlUserRepo = mysqlUserRepo;
  }

  get UserManager() {
    return this._userManager;
  }
  get UserRepo() {
    return this._mysqlUserRepo;
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
    try {
      const result = await this.UserRepo.findAll();
      this.httpOk(res, { data: result });
    } catch (error) {
      this.httpInternalServerError(res, error.message);
    }
  }
}

export default UserController;
