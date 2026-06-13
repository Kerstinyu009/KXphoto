// 引入工具
const express = require('express');
const cors = require('cors');
const app = express();
// 監聽
const port = 3000;
app.listen(port, function(){
    console.log('Server is working...')
});

// 傳 json 資料
app.use(express.json())
app.use(cors());

// 接收資料
// 前端傳資料
app.post('/login', function(req,res){
    const email = req.body.memberEmail;
    const psw = req.body.memberPsw;
    // 後端印數據，是否成功送達
    console.log("OK", email);
    console.log("OK", psw);
    // 回傳結果給前端
    res.json({
        status: 'success',
        message: '後端成功收到資料'
    });
});
