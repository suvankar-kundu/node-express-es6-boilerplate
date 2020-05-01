import express from "express";
import middlewareHttpLogging from "../lib/api/middlewares/middleware-logger";
import { middlewareRequestParserURLEncode } from "../lib/api/middlewares/middleware-request-parser";
import middlewareCors from "../lib/api/middlewares/middleware-cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../openapi.json";
import MongoRepository from "../lib/repositories/mongo-repository";
import UserManager from "../logic/userManager";
import UserController from "./controllers/userController";
import UserRouter from "./routes/userRouter";

export default async function Application(
  authenticationDb,
  cacheProvider,
  cacheConfig,
  corsConfig,
  securityConfig,
  logger
) {
  const application = express();
  const userRepository = new MongoRepository(authenticationDb, "User");
  const userStore = cacheProvider.createStore(
    cacheConfig.stores.users.identifier
  );
  const userManager = new UserManager(userRepository, userStore);
  const userController = new UserController(userManager, logger);
  const userRouter = UserRouter(userController);
  middlewareHttpLogging(application, logger);
  middlewareRequestParserURLEncode(application);
  middlewareCors(app, corsConfig);

  const apiRouter = express.Router();
  apiRouter.use("/user", userRouter.Router);
  app.use("/api", apiRouter);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );
  return app;
}
