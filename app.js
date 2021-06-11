//external imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

//internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/erroeHndler");

const app = express();
dotenv.config();

//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfwri.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Connect to the MongoDB cluster
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("databasea connection successful!"))
  .catch((err) => console.log("database connection failed!", err));

//resquest parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

//404 not found handler
app.use(notFoundHandler);

//common error handling
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`App listening to port ${process.env.PORT}`);
});
