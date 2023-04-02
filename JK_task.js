
const user_trip_list = [
    { day: 'MONDAY', time: '09:20', fromZone: 1, toZone: 1 },
    { day: 'MONDAY', time: '10:20', fromZone: 1, toZone: 2 },
    { day: 'MONDAY', time: '10:20', fromZone: 1, toZone: 2 },
    { day: 'MONDAY', time: '12:20', fromZone: 1, toZone: 1 },
    { day: 'MONDAY', time: '15:20', fromZone: 2, toZone: 2 },
    { day: 'SUNDAY', time: '19:20', fromZone: 1, toZone: 1 },
    { day: 'SUNDAY', time: '20:20', fromZone: 2, toZone: 1 },
    { day: 'SUNDAY', time: '20:20', fromZone: 1, toZone: 2 },
    { day: 'SUNDAY', time: '20:20', fromZone: 2, toZone: 1 },
    { day: 'SUNDAY', time: '20:20', fromZone: 1, toZone: 2 },
    { day: 'MONDAY', time: '17:20', fromZone: 1, toZone: 1 },
    { day: 'TUESDAY', time: '10:20', fromZone: 2, toZone: 2 },
    { day: 'TUESDAY', time: '15:20', fromZone: 1, toZone: 2 }
];

const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const weekends = ['SATURDAY', 'SUNDAY'];


const assign_fare_to_trip_weekdays = (trip, time, is_weekday, max_amount, curr_amount) => {

    // console.log(time, is_weekday)

    if (trip.fromZone & trip.toZone === 1) {
        const fare_amount = ((time >= (is_weekday ? 7 : 9) && time <= (is_weekday ? 10.3 : 11))) || ((time >= (is_weekday ? 17 : 18) && time <= (is_weekday ? 20 : 22))) ? 30 : 25;
        return { ...trip, fare: curr_amount + fare_amount < max_amount ? fare_amount : max_amount - curr_amount }

    } else if ((trip.fromZone === 1 && trip.toZone === 2) || (trip.fromZone === 2 && trip.toZone === 1)) {

        if (trip.fromZone === 2) {

            // console.log((time>=(is_weekday ? 17 : 18) && time <= (is_weekday ? 20 : 22)) && 30)

            const fare_amount = (time >= (is_weekday ? 17 : 18) && time <= (is_weekday ? 20 : 22)) ? 30 : 30;
            return { ...trip, fare: curr_amount + fare_amount < max_amount ? fare_amount : max_amount - curr_amount }
        }

        const fare_amount = ((time >= (is_weekday ? 7 : 9) && time <= (is_weekday ? 10.3 : 11)) || (time >= (is_weekday ? 17 : 18) && time <= (is_weekday ? 20 : 22))) ? 35 : 30;
        return { ...trip, fare: curr_amount + fare_amount < max_amount ? fare_amount : max_amount - curr_amount }

    } else {
        const fare_amount = ((time >= (is_weekday ? 7 : 9) && time <= (is_weekday ? 10.3 : 11))) || ((time >= (is_weekday ? 17 : 18) && time <= (is_weekday ? 20 : 22))) ? 25 : 20;
        return { ...trip, fare: curr_amount + fare_amount < max_amount ? fare_amount : max_amount - curr_amount }
    }

}

const week = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const calculate_daily_fare = (list) => {
    const result = list;

    let i = 0;
    while (i < list.length) {

        let j = i;
        let day_max_fare_amount = 0;
        while (j < list.length && list[j].day === list[i].day) {
            // console.log(list[j])
            let trip = list[j];
            if (trip.fromZone & trip.toZone === 1) {
                day_max_fare_amount = day_max_fare_amount < 100 ? 100 : day_max_fare_amount;
            } else if ((trip.fromZone === 1 && trip.toZone === 2) || (trip.fromZone === 2 && trip.toZone === 1)) {
                day_max_fare_amount = day_max_fare_amount < 120 ? 120 : day_max_fare_amount;
            } else {
                day_max_fare_amount = day_max_fare_amount < 80 ? 80 : day_max_fare_amount;
            }
            j++;
        }

        // let k;
        // if (week.includes(list[i].day)) {
        //     // find the index of first sunday from current index
        //     let first_idx = list.indexOf('SUNDAY', i);
        //     console.log(first_idx)
        //     k = first_idx > 0 ? first_idx : list.length;
        //     while (list[j] === 'SUNDAY') {
        //         k++
        //     }
        //     console.log(j)
        //     const new_arr = list.slice(i, k);
        //     console.log(new_arr)
        // }
        // i = k;



        // console.log(day_max_fare_amount)

        // i = starting point , j = endign point of current day

        const current_day_trips_list = list.slice(i, j);
        // console.log('===', current_day_trips_list)

        let current_day_charges = 0;
        current_day_trips_list.forEach((trip, idx) => {
            const time = parseFloat(trip.time.replace(':', '.'));

            let trip_fare;
            if (weekDays.includes(trip.day)) {

                trip_fare = assign_fare_to_trip_weekdays(trip, time, true, day_max_fare_amount, current_day_charges)
                current_day_charges += trip_fare.fare;

            } else {
                trip_fare = assign_fare_to_trip_weekdays(trip, time, false, day_max_fare_amount, current_day_charges)
                current_day_charges += trip_fare.fare;
            }
            result[i + idx] = trip_fare;

            // console.log(current_day_charges)
        })


        i = j++;

    }

    return result;
}

const daily_fare_result = calculate_daily_fare(user_trip_list);
console.log(daily_fare_result)

