import app from './service/app';
import initDb from './service/init/init-db';

import dbConfig from '../config/development/db.json';
import logConfig from '../config/development/log.json';

//#region Common components
import ApplicationLogger from './common/lib/logger';
import ModelOfTRepository from './data/repositories/modelOfTRepository';
import UserController from './service/controllers/userController';
//#endregion

//#region User
import UserModel from './data/models/userModel';
import UserRouter from './service/routes/userRouter';
//#endregion


Promise.all([
    initDb(dbConfig.cnd)
]).then(([dbConnection]) => {

    const logger = new ApplicationLogger(logConfig);
    const userRepository = new ModelOfTRepository(UserModel(dbConnection));
    const userController = new UserController(userRepository, logger);
    const userRouter = new UserRouter(userRepository, userController);

    app(logger, userRepository, userRouter);
    process.on('SIGINT', async () => {
        await dbConnection.close();
    });
}).catch(err => {
    console.log('An error occurred while initializing the application.', err);
});