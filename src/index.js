import appLication from './service/app';
import initDb from './service/init/init-db';

import dbConfig from '../config/development/db.json';
import logConfig from '../config/development/log.json';
import corsConfig from '../config/development/cors.json';
import securityConfig from '../config/development/security.json';

// #region Common components
import ApplicationLogger from './common/lib/logger';
// #endregion
const PORT = process.env.PORT || 5000;
Promise.all([
  initDb(dbConfig.cnd)
]).then(async ([dbConnection]) => {
  const logger = new ApplicationLogger(logConfig);
  const app = await appLication(logger, dbConnection, corsConfig, securityConfig);
  app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
  process.on('SIGINT', async () => {
    await dbConnection.close();
  });
}).catch(err => {
  console.log('An error occurred while initializing the application.', err);
});