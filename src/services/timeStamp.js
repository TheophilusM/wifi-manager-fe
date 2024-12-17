export const dateToTimestamp = (value) => {
    const date = new Date(value)
    const timeStamp = date.getTime();
    return timeStamp;
}