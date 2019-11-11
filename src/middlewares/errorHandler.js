import * as Yup from 'yup';
import HttpError from '../utils/HttpError';

// eslint-disable-next-line no-unused-vars
export default (err, _req, res, _next) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode);
        res.json({ error: err.message });
        return;
    }
    if (err instanceof Yup.ValidationError) {
        res.status(400);
        res.json({ error: err.message });
        return;
    }
    res.status(500);
    res.end();
};
