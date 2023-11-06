import moment from "moment"

export const filterAge = (row, columnId, value) => {
  const hours = moment(row.getValue(columnId), 'hh:mm').hours();
  if (value.length === 0) {
    return true;
  }
  if (value.includes('Less than one hour') && hours < 1) {
    return true;
  }
  if (value.includes('Between 1-23 hours') && hours >= 1 && hours <= 23) {
    return true;
  }
  if (value.includes('Between 24-48 hours') && hours >= 24 && hours <= 48) {
    return true;
  }
  if (value.includes('Between 49-71 hours') && hours >= 49 && hours <= 71) {
    return true;
  }
  if (value.includes('Greater than 72 hours') && hours >= 72) {
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
  } else if (value === '101+') {
    return priority >= 101;
  }
  return true;
};