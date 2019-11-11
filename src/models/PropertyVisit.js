import Sequelize, { Model } from 'sequelize';
import Property from './Property';
import sequelize from '../singletons/sequelize';

class PropertyVisit extends Model {}

PropertyVisit.init({
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    scheduledDate: { type: Sequelize.DATE },
    propertyId: { type: Sequelize.STRING },
    userId: { type: Sequelize.STRING },
    status: {
        type: Sequelize.ENUM([ 'scheduled', 'cancelled', 'done' ]),
        default: 'scheduled',
    },
}, {
    sequelize,
    scopes: {
        propertyScheduleResult: {
            attributes: {
                exclude: [ 'propertyId', 'status' ],
            },
        },
        userScheduleResult: {
            attributes: {
                exclude: [ 'userId' ],
            },
        },
    },
});

PropertyVisit.prototype.populateProperty = async function populateProperty() {
    const propertyId = this.getDataValue('propertyId');
    return Property.get(propertyId);
};

export default PropertyVisit;
