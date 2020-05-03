import mysql from "mysql";

/**
 * Established  a database connection to MongoDB and return the database
 * @param {*} dbConfig
 * @param {*} logger
 * @param {*} label
 */
export async function connect(dbConfig, logger, label = "MYSQL") {
  try {
    logger.log({ level: "info", label: label, message: "Connecting database" });
    const connection = await mysql.createPool(dbConfig);
    logger.log({
      level: "info",
      label: label,
      message: "Database connected successfully",
    });
    return connection;
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
