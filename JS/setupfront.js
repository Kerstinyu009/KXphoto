// 監聽點擊事件
$(document).ready(function () {
    $("#setupBtn").on("click", function (event) {
        //防止畫面跳轉
        event.preventDefault();
        //檢查密碼
        const psw = $("#setuppsw").val();
        const pswA = $("#setuppswA").val();
        if (psw != pswA) {
            alert("密碼不一致，請重新輸入");
            console.log("密碼不一致，請重新輸入");
            return;
        }
        //打包資料
        const setupData = {
            // 姓名
            firstname: $("#firstnameText").val(),
            lastname: $("#lastnameText").val(),
            //性別
            gender: $("#gendertitleGroup input:checked").val(),
            //生日
            birthdayM: $("#birthdayM").val(),
            birthdayD: $("#birthdayD").val(),
            birthdayY: $("#birthdayY").val(),
            //國家
            country: $("#counTry"),
            // 手機號碼
            phonenum: $("#phoneNum").val(),
            //電子信箱
            setupemail: $("#setupEmail").val(),
            //密碼
            setuppsw: $("#setuppsw").val(),
            //確認密碼
            setuppswA: $("#setuppswA").val()
        }
        // 給後端
        $.ajax({
            url: 'http://localhost:3000/setup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(setupData),
            
            // 成功執行
            success: function (res) {
                alert("會員註冊成功");
                console.log("後端傳送成功", res);
            },

            // 失敗執行
            error: function(res){
                alert("會員註冊失敗");
                console.log("後端傳送失敗", res);
            }

        });



    })
})