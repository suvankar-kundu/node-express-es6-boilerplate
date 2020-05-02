import morgan from "morgan";

// Custom morgan tokens
morgan.token("app-user", (req) => (req.user && req.user._id) || "anonymous");

export default function middlewareHttpLogging(application, logger) {
  application.use(
    morgan(
      ":remote-addr :app-user HTTP/:http-version :method :url  :status :response-time ms",
      {
        stream: logger.stream("Request"),
      }
    )
  );
}
