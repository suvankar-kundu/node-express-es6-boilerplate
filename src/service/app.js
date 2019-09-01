import express from 'express';
import middlewareLogging from './middleware/middleware-logger';
import middlewarePassport from './middleware/middleware-passport';
import middlewareRequestParser from './middleware/middleware-request-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../config/doc/swagger.json';

// #region Common components
import ModelOfTRepository from '../data/repositories/modelOfTRepository';
import middlewareCors from './middleware/middleware-cors';
// #endregion

// #region User
import UserModel from '../data/models/userModel';
import UserController from '../service/controllers/userController';
import UserRouter from '../service/routes/userRouter';
// #endregion

export default async function (
  logger,
  dbConnection,
  corsConfig,
  securityConfig
) {
  const app = express();

  const userRepository = new ModelOfTRepository(UserModel(dbConnection));
  const userController = new UserController(userRepository, logger);
  const userRouter = new UserRouter(userRepository, userController);

  middlewareLogging(app, logger);
  middlewareRequestParser(app);
  middlewarePassport(app, userRepository, securityConfig);
  middlewareCors(app, corsConfig);

  const apiRouter = express.Router();
  apiRouter.use('/user', userRouter.Router);
  app.use('/api', apiRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
}
