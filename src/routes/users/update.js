import * as Yup from 'yup';
import User from '../../models/User';
import Jwt from '../../utils/Jwt';

const validationSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string()
        .email(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.body);
        const { name, email } = req.body;
        const { id } = Jwt.verify(req.headers['x-auth-token']);
        await User.update({
            name,
            email,
        }, {
            where: { id },
        });
        res.json({ updated: true });
    } catch (err) {
        next(err);
    }
};
