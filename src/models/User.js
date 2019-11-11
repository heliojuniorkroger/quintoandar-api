import Sequelize, { Model } from 'sequelize';
import sequelize from '../singletons/sequelize';

class User extends Model {}

User.init({
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    name: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
}, { sequelize });

export default User;
