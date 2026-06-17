// 引入資料
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
// 傳 json 資料
app.use(express.json())

// 接收資料
// 前端傳資料
app.post('/setpsw', function(req,res){
    const email = req.body.forgetEmail;
    // 後端印數據，是否成功送達
    console.log("成功送達", email);
    // 回傳結果給前端 
    res.json({
        status: 'success',
        message: '後端成功收到資料'
    });
});

// 監聽
const port = 3000;
app.listen(port, function(){
    console.log('Server is working...')
});
