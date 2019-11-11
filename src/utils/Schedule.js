import moment from 'moment-business-days';

export default class Schedule {
    constructor(visits) {
        this.visits = visits;
    }

    fillHours(date) {
        return new Array(9).fill(null).map((_, i) => {
            const newDate = date.set({
                hour: 8 + i,
                minute: 0,
                second: 0,
                millisecond: 0,
            });
            const visit = this.visits.find(({ scheduledDate }) => (
                newDate.isSame(scheduledDate)
            )) || null;
            return {
                date: newDate.toDate(),
                visit,
            };
        });
    }

    addDate(resolve) {
        if (this.dates.length !== 63) {
            const lastDate = this.dates[this.dates.length - 1];
            const dates = this.fillHours(moment(lastDate.date).nextBusinessDay());
            this.dates = this.dates.concat(dates);
            this.addDate(resolve);
        } else {
            resolve(this.dates);
        }
    }

    createSchedule() {
        return new Promise((resolve) => {
            const firstDay = moment().isBusinessDay()
                ? moment()
                : moment().nextBusinessDay();
            this.dates = this.fillHours(firstDay);
            this.addDate(resolve);
        });
    }
}
