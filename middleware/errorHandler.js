const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${err.method}\t${err.url}`,
        "error.log"
    );

    // server error
    const status = res.statusCode ?? 500;

    res.status(status)

    res.json({ message: err.message });
}

module.exports = errorHandler;