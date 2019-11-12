import moment from 'moment-business-days';

const fillHours = (date) => new Array(9).fill(null).map((_, i) => {
    const newDate = date.set({
        hour: 8 + i,
        minute: 0,
        second: 0,
        millisecond: 0,
    }).toDate();
    return { date: newDate, visit: null };
});

export default class Schedule {
    constructor(visits) {
        this.visits = visits;
    }

    fillVisits() {
        this.dates.forEach(({ date }, index) => {
            const visit = this.visits.find(({ scheduledDate }) => (
                moment(date).isSame(scheduledDate)
            ));
            if (visit) this.dates[index].visit = visit;
        });
    }

    addDate(resolve) {
        if (this.dates.length !== 63) {
            const lastDate = this.dates[this.dates.length - 1];
            const dates = fillHours(moment(lastDate.date).nextBusinessDay());
            this.dates = this.dates.concat(dates);
            this.addDate(resolve);
        } else {
            if (this.visits) this.fillVisits();
            resolve(this.dates);
        }
    }

    createSchedule() {
        return new Promise((resolve) => {
            const firstDay = moment().isBusinessDay()
                ? moment()
                : moment().nextBusinessDay();
            this.dates = fillHours(firstDay);
            this.addDate(resolve);
        });
    }
}
