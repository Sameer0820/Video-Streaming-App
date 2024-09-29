function formatSubscription(count) {
    if (count < 1) return "0 subscriber";
    else if (count == 1) return "1 subscriber";
    else if (count > 1) return `${count} subscribers`;
}

export default formatSubscription;
