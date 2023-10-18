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