import { dateToTimestamp } from "./timeStamp";

export const sortArrayOfObjectDate = (a, b) => {
    const timeA = dateToTimestamp(a);
    const timeB = dateToTimestamp(b);
    if (timeA > timeB) {
        return 1
    } else if (timeB > timeA) {
        return -1
    } else {
        return 0
    }
};

export const sortArrayOfObject = (a, b) => {
    if (a > b) {
        return 1
    } else if (b > a) {
        return -1
    } else {
        return 0
    }
};
