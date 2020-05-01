import appLication from "./service/app";
import config from "../config/local/config.json";
import appLogger from "../src/lib/loggers/winston/index";
import dbConnect from "../src/lib/db/mongodb/index";
import { connect as cacheConnect } from "../src/lib/cache/redis/index";

const {
  db: dbConfig,
  cache: cacheConfig,
  cors: corsConfig,
  log: logConfig,
  security: securityConfig,
} = config;

const PORT = process.env.PORT || 5000;
const logger = appLogger(logConfig);

Promise.all([
  dbConnect(dbConfig),
  cacheConnect(
    cacheConfig.identifier,
    cacheConfig.connection.host,
    cacheConfig.connection.port,
    cacheConfig.connection.options,
    logger
  ),
])
  .then(
    async ([
      { database: authenticationDb, client: authenticationDbClient },
      cacheProvider,
    ]) => {
      const app = await appLication(
        authenticationDb,
        cacheProvider,
        cacheConfig,
        corsConfig,
        securityConfig,
        logger
      );
      const server = app.listen(PORT, () => {
        const { address, port } = this.address();
        logger.info({
          message: `process started successfully on ${address}:${port}.`,
        });
      });

      function shutDownHandler() {
        logger.info({ message: "Shuttling down.." });
        server.close();
        cacheProvider.close();
        authenticationDbClient.close();
        logger.info({ message: "Process existing" });
        process.exit();
      }
      process.on("SIGINT", shutDownHandler);
      process.on("SIGTERM", shutDownHandler);
    }
  )
  .catch((err) => {
    console.log("An error occurred while initializing the application.", err);
  });
