require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 8080;

app.use(logger);

app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")))

app.use("/", require("./routes/root"));

// * --> Wildcard, untuk menghandle error 404
app.all("*", (req, res) => {
    res.status(404);
    // jika req-nya berasal dari browser atau sejenisnya
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
        // jika req-nya berasal dari POSTMAN dkk
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
        // jika req berasal selain dari browser maupun postman
    } else {
        res.type("text").send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server berjalan pada port ${PORT}`));
