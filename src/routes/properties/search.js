import * as Yup from 'yup';
import Property from '../../models/Property';

const validationSchema = Yup.object().shape({
    size: Yup.number(),
    offset: Yup.number(),
    latitude: Yup.number()
        .required(),
    longitude: Yup.number()
        .required(),
    distance: Yup.string()
        .required()
        .test('measure', 'distance must be a numeric value + the measure', (value) => {
            const re = new RegExp(/^[0-9]{0,}\.?[0-9]{1,}?(km|m)$/);
            return re.test(value);
        }),
    minPrice: Yup.number(),
    maxPrice: Yup.number(),
    minArea: Yup.number(),
    maxArea: Yup.number(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.body);
        const {
            size,
            offset: from,
            latitude,
            longitude,
            distance,
            minPrice,
            maxPrice,
            minArea,
            maxArea,
        } = req.body;
        const query = {
            bool: {
                must: [
                    {
                        geo_distance: {
                            distance,
                            geometry: [ latitude, longitude ],
                        },
                    },
                ],
            },
        };
        if (minPrice || maxPrice) {
            const range = { price: { boost: 2.0 } };
            if (minPrice) range.price.gte = minPrice;
            if (maxPrice) range.price.lte = maxPrice;
            query.bool.must = [ ...query.bool.must, { range } ];
        }
        if (minArea || maxArea) {
            const range = { area: { boost: 2.0 } };
            if (minArea) range.area.gte = minArea;
            if (maxArea) range.area.lte = maxArea;
            query.bool.must = [ ...query.bool.must, { range } ];
        }
        const properties = await Property.search({
            query,
            size,
            from,
        });
        res.json(properties);
    } catch (err) {
        next(err);
    }
};
