import { Client } from 'elasticsearch';

export const normalize = (result) => {
    if (Array.isArray(result)) {
        return result.map((item) => ({ ...item._source, id: item._id }));
    }
    return { ...result._source, id: result._id };
};

export default new Client({ host: process.env.ELASTIC_HOST });
