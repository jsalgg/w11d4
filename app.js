// ./app.js
//external
const express = require("express");
const morgan = require("morgan");
//internal
const routes = require("./routes");

const app = express();
app.use(morgan("dev"));

app.set("view engine", "pug");

app.use(routes);

// Define a port and start listening for connections.

module.exports = app;
