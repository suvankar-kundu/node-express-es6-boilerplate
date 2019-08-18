import express from 'express';
import middlewareLogging from './middleware/middleware-logger';
import middlewarePassport from './middleware/middleware-passport';
import middlewareRequestParser from './middleware/middleware-request-parser';

import CorsConfig from '../../config/development/cors.json';
import SecurityConfig from '../../config/development/security.json';
import middlewareCors from './middleware/middleware-cors';
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../../config/doc/swagger.json');


const PORT = process.env.PORT || 5000;
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default function (
    logger,
    userRepository,
    userRouter
) {
    middlewareLogging(app, logger);
    middlewareRequestParser(app);
    middlewarePassport(app, userRepository, SecurityConfig);
    middlewareCors(app, CorsConfig);

    const apiRouter = express.Router();
    apiRouter.use('/user', userRouter.Router);
    app.use('/api', apiRouter);

    app.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
    });
}
