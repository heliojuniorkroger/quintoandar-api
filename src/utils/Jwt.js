import jwt from 'jsonwebtoken';

export default class Jwt {
    static verify(token, callback) {
        return jwt.verify(token, process.env.JWT_SECRET, callback);
    }

    static sign(id, callback) {
        return jwt.sign({ id }, process.env.JWT_SECRET, callback);
    }
}
