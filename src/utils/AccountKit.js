import fetch from 'node-fetch';
import qs from 'qs';

export default class AccountKit {
    static async validate(accessToken) {
        const params = qs.stringify({ access_token: accessToken });
        return fetch(`https://graph.accountkit.com/v1.3/me/?${params}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
