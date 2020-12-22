const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv");
const User = require("./models/User.js");
env.config();
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


//회원 가입 할때 필요한 정보들을 client에서 가져오면
//그것들을 데이터 베이스에 넣어준다.
app.post("/register", (req, res) => {
  const user = new User(req.body);
  
  user.save((err, userInfo) => {
    if (err) {
      return  res.json({
        success: false,
        err
      });
    } else {
      return res.status(200).json({
        success: true
      });
    }
  })
})

app.listen(port, () => console.log(`Let's go color brothers http://localhost:${port}`));
