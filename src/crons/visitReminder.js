import { CronJob } from 'cron';
import VisitReminder from '../utils/VisitReminder';

export default () => {
    new CronJob('* * 18 * * *', async () => {
        const visitsForTomorrow = await VisitReminder.findVisitsForTomorrow();
        visitsForTomorrow.forEach((visit) => {
            // send notification
            VisitReminder.remove(visit.id);
        });
    }).start();
};
