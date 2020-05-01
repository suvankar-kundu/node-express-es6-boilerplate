import { MongoClient } from "mongodb";
import fs from "fs";
import { isNullOrUndefined } from "../../validators/index";
/**
 * Established  a database connection to MongoDB and return the database
 * @param {*} dbConfig
 * @param {*} logger
 * @param {*} label
 */
export async function connect(dbConfig, logger, label = "DB") {
  try {
    const mongoOptions = Object.assign({}, dbConfig.options, {
      useNewUrlParser: true,
    });
    if (
      !isNullOrUndefined(mongoOptions.sslCA) &&
      !Buffer.isBuffer(mongoOptions.sslCA)
    ) {
      mongoOptions.sslCA = fs.readFileSync(mongoOptions.sslCA);
    }
    if (
      !isNullOrUndefined(mongoOptions.sslKey) &&
      !Buffer.isBuffer(mongoOptions.sslKey)
    ) {
      mongoOptions.sslKey = fs.readFileSync(mongoOptions.sslKey);
    }
    if (
      !isNullOrUndefined(mongoOptions.sslCert) &&
      !Buffer.isBuffer(mongoOptions.sslCert)
    ) {
      mongoOptions.sslCert = fs.readFileSync(mongoOptions.sslCert);
    }
    logger.log({ level: "info", label: label, message: "Connecting database" });
    const client = await MongoClient.connect(dbConfig.connection, mongoOptions);
    const database = client.db();
    logger.log({
      level: "info",
      label: label,
      message: "Database connected successfully",
    });
    return { database, client };
  } catch (error) {
    logger.log({
      level: "error",
      label: label,
      message: "Database connect failed",
      error,
    });
    throw error;
  }
}
