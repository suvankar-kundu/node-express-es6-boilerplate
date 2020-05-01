import cors from "cors";

export default function middlewareCors(application, corsConfig) {
  application.use(cors(corsConfig));
  application.options("/api/*", cors(corsConfig));
}
