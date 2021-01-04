const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const env = require("dotenv");
const userRouter = require("./routes/user");
const kasRouter = require("./routes/kas_api");
env.config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_DB_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(()=>console.log("mongoDB connection"))
  .catch((err) => console.log(err));

  
app.get("/", (req, res) => res.send("컬러브라더스 시작"));

app.use("/api/users",userRouter); //로그인,회원가입,로그아웃 등 유저와 관련된 API
app.use("/api/kas",kasRouter);// KAS SDK사용을 위한 API

app.listen(port, () => console.log(`Let's go color brothers http://localhost:${port}`));