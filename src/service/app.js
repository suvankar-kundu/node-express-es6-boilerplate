import express from "express";
import middlewareHttpLogging from "../lib/api/middlewares/middleware-logger";
import {
  middlewareRequestParserURLEncode,
  middlewareRequestParserJSON,
} from "../lib/api/middlewares/middleware-request-parser";
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
  const userRouter = new UserRouter(userController);
  middlewareHttpLogging(application, logger);
  middlewareRequestParserURLEncode(application);
  middlewareRequestParserJSON(application);
  middlewareCors(application, corsConfig);

  const apiRouter = express.Router();
  apiRouter.use("/user", userRouter.Router);
  application.use("/api", apiRouter);
  application.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );
  return application;
}
