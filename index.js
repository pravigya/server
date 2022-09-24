const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => console.log(`server on port: ${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

mongoose.connect(process.env.MDB_CONNECT, (err) => {
  if (err) return console.error(err);
  console.log("connected to db");
});

//routes
app.use("/auth", require("./routes/userRoute"));
app.use("/customer", require("./routes/customerRoute"));
