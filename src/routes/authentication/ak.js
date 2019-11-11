import * as Yup from 'yup';
import AccountKit from '../../utils/AccountKit';
import HttpError from '../../utils/HttpError';
import User from '../../models/User';
import Jwt from '../../utils/Jwt';

const validationSchema = Yup.object().shape({
    accessToken: Yup.string()
        .required(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.body);
        const { accessToken } = req.body;
        const response = await AccountKit.validate(accessToken);
        if (response.status === 400) throw new HttpError(401, 'invalid accesstoken');
        const data = await response.json();
        const { number } = data.phone;
        const [ user ] = await User.findOrCreate({
            where: { phone: number },
            defaults: {
                phone: number,
            },
        });
        const token = Jwt.sign(user.id);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
