import Jwt from '../../utils/Jwt';
import User from '../../models/User';

export default async (req, res) => {
    const { id } = Jwt.verify(req.headers['x-auth-token']);
    const user = await User.findByPk(id);
    res.json(user);
};
