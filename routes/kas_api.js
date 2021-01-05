const express = require("express");
const app = express();
const CaverExtKAS = require("caver-js-ext-kas");
const User = require("../models/User.js")
const auth = require('../middleware/Auth');
require('dotenv').config();

//KAS SDK
const caver = new CaverExtKAS();
caver.initKASAPI(process.env.CHAIN_ID, process.env.ACCESS_KEY, process.env.SECRET_ACCESS_KEY);


app.get("/addWallet", auth, async (req, res) => {
    const account = await caver.kas.wallet.createAccount();
    console.log(account.address);
    
    User.findOneAndUpdate({_id: req.user._id},
    {walletAddress: account.address},
    (err, user) => {
      if (err) return res.json({
        success: false,
        err: "실패"
      })
      return res.json({
        success: true,
        err: "성공"
      })
    })
})

module.exports = app;