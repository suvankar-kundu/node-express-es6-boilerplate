import * as HttpStatus from '../../common/lib/httpStatusCodes';
class ApiController {
  constructor() {
  }
  httpCreated(response, data) {
    sendResponse(response, HttpStatus.Created, data);
  }

  httpOk(response, data) {
    sendResponse(response, HttpStatus.OK, data);
  }

  httpInternalServerError(response, data) {
    sendResponse(response, HttpStatus.InternalServerError, data);
  }

  httpNotFound(response, data) {
    sendResponse(response, HttpStatus.NotFound, data);
  }

  httpNotContent(response) {
    return response.status(HttpStatus.NoContent).end();
  }

  httpBadRequest(response, data) {
    sendResponse(response, HttpStatus.BadRequest, data);
  }

  httpUnauthorized(response, data) {
    sendResponse(response, HttpStatus.Unauthorized, data);
  }

  sendResponse(response, code, data) {
    return response.status(code).json(data);
  }
}

export default ApiController;