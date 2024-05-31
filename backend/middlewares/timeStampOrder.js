
const getTimeStamp = () => {
    const date = new Date();
    const cetDate = new Date(date.toLocaleString("en-GB", { timeZone: "Europe/Stockholm" }));
    return cetDate.toISOString();
};

const timeStampOrder = (req, res, next) => {
    if (!req.body) {
        req.body = {}; // Ensure req.body is defined
    }
    if (!req.body.order) {
        req.body.order = {}; // Ensure req.body.order is defined
    }
    req.body.order.timeStamp = getTimeStamp();
    next();
};

export default timeStampOrder;