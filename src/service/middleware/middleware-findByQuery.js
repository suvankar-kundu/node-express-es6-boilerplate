import * as HttpStatus from '../../common/lib/httpStatusCodes';

export default function (repositiryOfT, props = []) {
    return async function (req, res, next) {
        try {
            const entity = await repositiryOfT.findOne(props.reduce((acc, curr) => {
                acc[curr] = req.body[curr];
                return acc;
            }, {}));
            if (entity) {
                req._entity = entity;
                next();
            } else {
                res.status(HttpStatus.NotFound)
                    .send(`Entity (query: ${JSON.stringify(req._query)}) not found`);
            }
        } catch (err) {
            res.status(HttpStatus.InternalServerError).send(err);
        }
    };
}