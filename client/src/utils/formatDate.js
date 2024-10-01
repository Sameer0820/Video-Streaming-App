function formatDate(timestamp) {
    const date = new Date(timestamp);
    const days = date.getDate();
    const months = date.getMonth() + 1;

    const day = days < 10 ? "0" + days : days;
    const month = months < 10 ? "0" + months : months;

    return day + "/" + month + "/" + date.getFullYear();
}

export default formatDate