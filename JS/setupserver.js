// 建立 web 文件
const express = require("express");
const app = express();

// 跨域
const cors = require("cors");
app.use(cors());

// 解析表單及 json 資料
const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// 等用戶連線
app.listen(3000);
console.log("Server is working...");

// 收前端資料
app.post("/setup", function(request,response){
    var firstname = request.body.firstname;
    var lastname = request.body.lastname;
    var gender = request.body.gender;
    var birthdayM = request.body.birthdayM;
    var birthdayD = request.body.birthdayD;
    var birthdayY = request.body.birthdayY;
    var country = request.body.country;
    var phonenum = request.body.phonenum;
    var setupemail = request.body.setupemail;
    var setuppsw= request.body.setuppsw;
    var setuppswA= request.body.setuppswA
// 查看後端是否接收到資料
console.log("成功收到註冊請求，email為:", setupemail);

// 回傳結果給前端
response.status(200).json({
    status: "success",
    message: "後端已經收到資料"
});
});
