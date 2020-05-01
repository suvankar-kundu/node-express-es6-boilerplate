import { json, urlencoded } from "body-parser";

export function middlewareRequestParserURLEncode(app) {
  app.use(
    urlencoded({
      extended: false,
    })
  );
}

export function middlewareRequestParserJSON(app, options) {
  app.use(json(options));
}
