import moment from "moment"

export const getAgeLimit = (age) => {
    if (age <= 3600) {
        return "Less than one hour old"
    }
    if (age > 3600 && age <= 172800) {
        return "Between 24-48 hours old"
    }
    if (age > 172800 && age <= 25920) {
        return "Between 48-72 hours old"
    }
    if (age > 259200) {
        return "Greater than 72 hours old"
    }
    return age;
}

export const getPriority = (priority) => {
    if (priority <= 40) {
        return "0-40"
    }
    if (priority > 40 && priority <= 100) {
        return "41-100"
    }
    if (priority > 100) {
        return "+101"
    }
    return priority;
}

export const filterAge = (row, columnId, value) => {
    const hours = moment(row.getValue(columnId), 'hh:mm').hours();
    if (value.length === 0) {
        return true;
    }
    if (value.includes('Less than one hour old') && hours < 1) {
        return true;
    }
    if (value.includes('Between 1-24 hours old') && hours >= 1 && hours <= 24) {
        return true;
    }
    if (value.includes('Between 24-48 hours old') && hours > 24 && hours <= 48) {
        return true;
    }
    if (value.includes('Between 48-72 hours old') && hours >= 48 && hours <= 72) {
        return true;
    }
    if (value.includes('Greater than 72 hours old') && hours > 72) {
        return true;
    }
    return false;
};

export const isWithinRange = (row, columnId, value) => {
    const priority = row.getValue(columnId);
    if (value === '0-40') {
        return priority >= 0 && priority <= 40;
    } else if (value === '41-100') {
        return priority >= 41 && priority <= 100;
    } else if (value === '+101') {
        return priority > 100;
    }
    return true;
};