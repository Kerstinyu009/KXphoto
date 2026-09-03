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
    // console.log('點擊按鈕，列印成功', loginformData)

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
            // console.log('後端回傳結果', data);

            if (data.status === 'success') {
                alert('會員登入成功');

                // 其他頁面使用
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // 跳轉至首頁
                window.location.href = '../index.html'; 
            } else {
                // 如果登入失敗，顯示後端傳來的錯誤訊息
                alert(data.message || '登入失敗，請檢查帳號密碼！');
            }
        })
        //捕捉網路連線等異常錯誤
        .catch(function (error) {
            console.error('登入發生錯誤：', error);
            alert('無法連線至伺服器，請確認後端是否已啟動。');
        });

});