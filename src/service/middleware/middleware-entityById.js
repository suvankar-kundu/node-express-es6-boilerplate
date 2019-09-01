import * as HttpStatus from '../../common/lib/httpStatusCodes';

export default function (repositiryOfT) {
  return async function (req, res, next) {
    try {
      const entity = await repositiryOfT.getById(req.params.id);
      if (entity) {
        req._entity = entity;
        next();
      } else {
        res.status(HttpStatus.NotFound)
          .send(`Entity (ID: ${req.params.id}) not found`);
      }
    } catch (err) {
      res.status(HttpStatus.InternalServerError).send(err);
    }
  };
}