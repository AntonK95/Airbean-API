// const getTimeStamp = () => {
//     const date = new Date();
//     const cetDate = new Date(date.toLocaleString("en-GB", { timeZone: "Europe/Stockholm" }));
//     console.log("Generated Timestamp:", cetDate.toISOString());
//     return cetDate.toISOString();
// };


//skapar en timeSTamp
const getTimeStamp = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate}${formattedTime}`;
}


//lägger en timeSTamp i req.body
const timeStampOrder = (req, res, next) => {
    console.log("Running timeStampOrder Middleware");
    if (!req.body) {
        req.body = {};
    }
    
    if (!req.body.order) {
        req.body.order = {};
    }
    req.body.timeStamp = getTimeStamp();
    next();
};;

export default timeStampOrder;