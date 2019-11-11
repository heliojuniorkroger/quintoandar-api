import User from '../models/User';
import Jwt from '../utils/Jwt';

export default async (req, res, next) => {
    if (req.url.startsWith('/authentication')) {
        next();
        return;
    }
    Jwt.verify(req.headers['x-auth-token'], async (err, decoded) => {
        if (err) {
            res.status(401);
            res.json({ error: err.message });
            return;
        }
        const { id } = decoded;
        const user = await User.findByPk(id);
        if (user) {
            next();
        } else {
            res.status(403);
            res.json({ error: 'jwt do not belong to a user' });
        }
    });
};
