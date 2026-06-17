// 月份迴圈
$(document).ready(function(){
    for (let m=1; m<=12; m++){
        $("#birthdayM").append(`<option value="${m}">${m}月</option>`)
    }
});
// 日期迴圈
$(document).ready(function(){
    for (let d=1; d<=31; d++) {
        $("#birthdayD").append(`<option value="${d}">${d}日</option>`)
    }
});

// 年份迴圈
// 目前年份
let currentYear = new Date().getFullYear();
$(document).ready(function(){
    for (let y=1926; y<=currentYear; y++) {
        $("#birthdayY").append(`<option value="${y}">${y}年</option>`)
    }
});

// 自動連動手機號碼
$(document).ready(function(){
    // 預設國碼
    $("#phoneNum").val($("phoneCountry").val());
    // 監聽事件，右方連動切換
    $("#phoneCountry").change(function(){
        // 抓取當前國碼
        let selectedCode = $(this).val();

        // 填入左邊
        $("#phoneNum").val(selectedCode);
    })
})

