import { json, urlencoded } from 'body-parser';

export default (app) => {
    app.use(json());
    app.use(urlencoded({
        extended: true,
    }));
};
