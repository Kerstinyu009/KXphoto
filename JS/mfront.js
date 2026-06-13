// 抓資料
const loginForm = document.getElementById('loginBox');
// 監聽
loginForm.addEventListener('submit', function (loginEvent) {
    // 防止網頁跳轉
    loginEvent.preventDefault();
    // 打包資料
    const loginformData = {
        memberEmail: document.getElementById('memberEmail').value,
        memberPsw: document.getElementById('memberPsw').value
    }
    // 列印資料
    console.log('點擊按鈕，列印成功', loginformData)

    // 給後端
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(loginformData)
    })
        // 後端回傳結果
        .then(function (res) {
            return res.json();
        })
        // 後端資料入
        .then(function (data) {
            console.log('後端回傳結果', data);
            alert('會員登入成功');
            // 重設／清空
            loginForm.reset();
        });

});
