// Logger middleware för att få ut i konsollen vilka anrop som görs med vilken endpoint

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

export default logger;