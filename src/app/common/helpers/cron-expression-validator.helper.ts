export function isValidCronExpression(cronExpression: string): boolean {
    const MAX_MIN_SEC_VALUE = 59;
    const MAX_HOUR_VALUE = 23;

    if (cronExpression === "* * * * *") {
        return true;
    }

    if (!/\s/g.test(cronExpression)) {
        return false;
    }

    const cronArray = cronExpression.split(" ");

    if (cronArray.length !== 5) {
        return false;
    }

    const minutes = cronArray[0].trim();
    const hours = cronArray[1].trim();
    const dayOfMonth = cronArray[2].trim();
    const month = cronArray[3].trim();
    const dayOfWeek = cronArray[4].trim();

    if (dayOfWeek === "?" && dayOfMonth === "?") {
        return false;
    }

    const isValidMinutes = isValidTimeValue(minutes, MAX_MIN_SEC_VALUE);
    const isValidHour = isValidTimeValue(hours, MAX_HOUR_VALUE);
    const isValidDayOfMonth = isValidDayOfMonthValue(dayOfMonth, dayOfWeek);
    const isValidMonth = isValidMonthValue(month);
    const isValidDayOfWeek = isValidDayOfWeekValue(dayOfWeek, dayOfMonth);

    const isValidCron = isValidMinutes && isValidHour && isValidDayOfMonth && isValidMonth && isValidDayOfWeek;

    return isValidCron;
}

function isValidMonthValue(month: string): boolean {
    const MONTH_LIST = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    if (month === "*") {
        return true;
    } else if (month.includes("/")) {
        const startingMonthOptionArr = month.split("/");
        return (
            isValidateMonthNo([startingMonthOptionArr[0]], 1, 12) &&
            isValidateMonthNo([startingMonthOptionArr[1]], 0, 12)
        );
    } else if (month.includes("-")) {
        const monthRangeArr = month.split("-");

        return !isNaN(parseInt(monthRangeArr[0])) && !isNaN(parseInt(monthRangeArr[1]))
            ? isValidateMonthNo(monthRangeArr, 1, 12)
            : isValidateMonthStr(monthRangeArr, MONTH_LIST);
    } else if (month.includes(",")) {
        const multiMonthArr = month.split(",");

        return !isNaN(parseInt(multiMonthArr[0]))
            ? isValidateMonthNo(multiMonthArr, 1, 12)
            : isValidateMonthStr(multiMonthArr, MONTH_LIST);
    } else if (typeof month === "string") {
        return !isNaN(parseInt(month)) ? isValidateMonthNo([month], 1, 12) : isValidateMonthStr([month], MONTH_LIST);
    } else {
        return false;
    }
}

function isValidTimeValue(time: string, val: number): boolean {
    if (time === "*" || time === "0") {
        return true;
    } else if (time.includes("/")) {
        const startingSecOptionArr = time.split("/");

        return (
            isValidateTime(startingSecOptionArr, val) ||
            (startingSecOptionArr[0] === "*" && isValidateTime([startingSecOptionArr[1]], val))
        );
    } else if (time.includes("-")) {
        if (time.includes(",")) {
            const multiSecArr = time.split(",");
            const values = multiSecArr.filter((e) => !e.includes("-"));
            const timegap = multiSecArr.filter((e) => e.includes("-"));
            const timegapArr = timegap.join("-").split("-");
            const combineArr = values.concat(timegapArr);

            return isValidateTime(combineArr, val);
        } else {
            const secRangeArr = time.split("-");
            return isValidateTime(secRangeArr, val);
        }
    } else if (time.includes(",")) {
        const multiSecArr = time.split(",");
        return isValidateTime(multiSecArr, val);
    } else if (parseInt(time) >= 0 && parseInt(time) <= val) {
        return true;
    } else {
        return false;
    }
}

function isValidDayOfMonthValue(dayOfMonth: string, dayOfWeek: string): boolean {
    if ((dayOfMonth === "*" && dayOfWeek !== "*") || (dayOfMonth === "?" && dayOfWeek !== "?")) {
        return true;
    } else if (dayOfMonth.includes("/") && dayOfWeek === "?") {
        const startingDayOfMonthOptionArr = dayOfMonth.split("/");
        const isValidElements =
            isValidateMonthNo([startingDayOfMonthOptionArr[0]], 1, 31) &&
            isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31);
        const isValidFirstElem =
            startingDayOfMonthOptionArr[0] === "*" && isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31);
        return isValidElements || isValidFirstElem;
    } else if (dayOfMonth.includes("-") && dayOfWeek === "?") {
        const dayOfMonthRangeArr = dayOfMonth.split("-");
        return isValidateMonthNo(dayOfMonthRangeArr, 1, 31);
    } else if (dayOfMonth.includes(",") && dayOfWeek === "?") {
        const multiDayOfMonthArr = dayOfMonth.split(",");
        return isValidateMonthNo(multiDayOfMonthArr, 1, 31);
    } else if (typeof dayOfMonth === "string" && dayOfWeek === "?" && dayOfMonth !== "?") {
        return parseInt(dayOfMonth) >= 1 && parseInt(dayOfMonth) <= 31;
    } else {
        return false;
    }
}

function isValidDayOfWeekValue(dayOfWeek: string, dayOfMonth: string): boolean {
    const WEEK_ARRRAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    if (dayOfWeek === "?" && dayOfMonth !== "?") {
        return true;
    }
    if (dayOfWeek === "*") {
        return dayOfMonth !== "*";
    } else if (dayOfWeek.includes("/") && dayOfMonth === "?") {
        const startingDayOfWeekOptionArr = dayOfWeek.split("/");
        return (
            isValidateMonthNo([startingDayOfWeekOptionArr[0]], 1, 7) &&
            isValidateMonthNo([startingDayOfWeekOptionArr[1]], 0, 7)
        );
    } else if (dayOfWeek.includes("-") && dayOfMonth === "?") {
        const dayOfWeekRangeArr = dayOfWeek.split("-");
        return !isNaN(parseInt(dayOfWeekRangeArr[0])) && !isNaN(parseInt(dayOfWeekRangeArr[1]))
            ? isValidateMonthNo(dayOfWeekRangeArr, 1, 7)
            : isValidateMonthStr(dayOfWeekRangeArr, WEEK_ARRRAY);
    } else if (dayOfWeek.includes(",") && dayOfMonth === "?") {
        const multiDayOfWeekArr = dayOfWeek.split(",");
        return !isNaN(parseInt(multiDayOfWeekArr[0]))
            ? isValidateMonthNo(multiDayOfWeekArr, 1, 7)
            : isValidateMonthStr(multiDayOfWeekArr, WEEK_ARRRAY);
    } else if (dayOfWeek.includes("#") && dayOfMonth === "?") {
        return false;
    } else if (typeof dayOfWeek === "string" && dayOfMonth === "?") {
        return !isNaN(parseInt(dayOfWeek))
            ? isValidateMonthNo([dayOfWeek], 1, 7)
            : isValidateMonthStr([dayOfWeek], WEEK_ARRRAY);
    } else {
        return false;
    }
}

function isValidateMonthNo(monthArr: string[], val: number, endVal: number): boolean {
    return monthArr.every(function (month: string) {
        return parseInt(month) >= val && parseInt(month) <= endVal;
    });
}

function isValidateMonthStr(monthArr: string[], dataArr: string[]) {
    return monthArr.every(function (month) {
        return dataArr.includes(month.toLowerCase());
    });
}

function isValidateTime(dataArray: string[], value: number): boolean {
    return dataArray.every(function (element) {
        return parseInt(element) >= 0 && parseInt(element) <= value;
    });
}
