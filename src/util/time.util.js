export const secondsToTime = (secs) => {

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds).toString();

    return `${minutes}:${seconds.padStart(2, '0')}`;
}