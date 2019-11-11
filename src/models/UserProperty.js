import Sequelize, { Model } from 'sequelize';
import Property from './Property';
import sequelize from '../singletons/sequelize';

class UserProperty extends Model {}

UserProperty.init({
    propertyId: { type: Sequelize.UUID },
    userId: { type: Sequelize.UUID },
}, { sequelize });

UserProperty.removeAttribute('id');

UserProperty.prototype.populate = async function populate() {
    const propertyId = this.getDataValue('propertyId');
    return Property.get(propertyId);
};

export default UserProperty;
