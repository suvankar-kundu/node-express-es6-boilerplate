import * as HttpStatus from "../../constants/httpStatus";

class ApiController {
  constructor(label, logger) {
    this._label = label;
    this._logger = logger;
  }
  get Label() {
    this._label;
  }
  get Logger() {
    this._logger;
  }

  log(level, logEntry) {
    this.Logger.log(Object.assign({}, logEntry, { label: this._label, level }));
  }

  logError(logEntry) {
    this.log("ERROR", logEntry);
  }

  httpCreated(response, data) {
    this.sendResponse(response, HttpStatus.Created, data);
  }

  httpOk(response, data) {
    this.sendResponse(response, HttpStatus.OK, data);
  }

  httpInternalServerError(response, data) {
    this.sendResponse(response, HttpStatus.InternalServerError, data);
  }

  httpNotFound(response, data) {
    this.sendResponse(response, HttpStatus.NotFound, data);
  }

  httpNotContent(response) {
    return response.status(HttpStatus.NoContent).end();
  }

  httpBadRequest(response, data) {
    this.sendResponse(response, HttpStatus.BadRequest, data);
  }

  httpUnauthorized(response, data) {
    this.sendResponse(response, HttpStatus.Unauthorized, data);
  }

  sendResponse(response, code, data) {
    return response.status(code).json(data);
  }
}

export default ApiController;
