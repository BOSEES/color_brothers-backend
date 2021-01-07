const express = require("express");
const app = express();
const User = require("../models/User.js");
const auth = require('../middleware/Auth');
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

app.post("/login", (req, res) => {
  //요청한 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청한 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
      
      //비밀번호까지 맞다면 토큰을 생성한다.
      user.gentoken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에?? 로컬스토리지 혹은 쿠키, 세션 등등 개취
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess : true , userId: user._id});
      })
    })
  })
})

app.get("/auth", auth , (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAhth: true,
    email: req.user.email,
    name: req.user.name,
    walletaddress : req.user.walletaddress,
    role: req.user.role,
    image: req.user.image
  })
})

app.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""},
    (err, user) => {
      if (err) return res.json({
        success: false,
        err
      })
      return res.status(200).send({
        success: true
      })
    }
    )
})

app.get("/wallet", auth, (req, res) => {
  User.findOne({_id:req.user.id}, (err, wallet) => {
    if (err) return res.json({
      error: err
    });
    return res.json(wallet);
  })
})

module.exports = app;