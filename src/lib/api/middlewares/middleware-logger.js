import morgan from "morgan";

// Custom morgan tokens
morgan.token("app-user", (req) => (req.user && req.user._id) || "anonymous");
morgan.token("content-type", (req) => req.headers("content-type"));

export default function middlewareHttpLogging(application, logger) {
  application.use(
    morgan(
      ":remote-addr :app-user HTTP/:http-version :method :url :content-type :status :response-time ms",
      {
        stream: logger.stream("Request"),
      }
    )
  );
}
