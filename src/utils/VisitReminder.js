import moment from 'moment';
import redisClient from '../singletons/redisClient';

export default class VisitReminder {
    static push(visit) {
        redisClient.get('visits', (err, visits) => {
            if (err) throw err;
            let _visits = JSON.parse(visits) || [];
            _visits = [ ..._visits, visit ];
            redisClient.set('visits', JSON.stringify(_visits));
        });
    }

    static remove(id) {
        redisClient.get('visits', (err, visits) => {
            if (err) throw err;
            let _visits = JSON.parse(visits);
            _visits = _visits.filter((visit) => visit.id !== id);
            redisClient.set('visits', JSON.stringify(_visits));
        });
    }

    static async findVisitsForTomorrow() {
        return new Promise((resolve) => {
            redisClient.get('visits', (err, visits) => {
                if (err) throw err;
                let _visits = JSON.parse(visits);
                const tomorrow = moment().add(1, 'd');
                _visits = _visits.filter(({ scheduledDate }) => tomorrow.isSame(scheduledDate, 'day'));
                resolve(_visits);
            });
        });
    }
}
