import elasticClient, { normalize } from '../singletons/elasticClient';

export default class Property {
    static async search(body) {
        const result = await elasticClient.search({
            index: 'properties',
            body,
        });
        return normalize(result.hits.hits);
    }

    static async get(id) {
        const result = await elasticClient.get({
            index: 'properties',
            id,
        });
        return normalize(result);
    }
}
