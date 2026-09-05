document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('nav-placeholder');

    if (placeholder) {
        // 判斷目前網址有沒有包含 /pages/
        const isInPagesFolder = window.location.pathname.includes('/pages/');

        // 在 pages 資料夾內就往上一層 (../) 抓，否則在根目錄直接抓 (./)
        const navPath = isInPagesFolder ? '../navBar.html' : './navBar.html';

        fetch(navPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('導覽列檔案載入失敗，請檢查路徑');
                }
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;

                if (isInPagesFolder) {
                    const links = placeholder.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('../')) {
                            link.setAttribute('href', '../' + href);
                        }
                    });

                    const logoImg = placeholder.querySelector('.navlogo');
                    if (logoImg) {
                        const src = logoImg.getAttribute('src');
                        if (src && !src.startsWith('http') && !src.startsWith('../')) {
                            logoImg.setAttribute('src', '../' + src);
                        }
                    }
                }

                // 更新會員名字
                const savedName = localStorage.getItem("userFirstName");
                const memberLink = placeholder.querySelector('a[href*="members.html"]');

                if (savedName && memberLink) {
                    // 替換文字為使用者名字
                    memberLink.textContent = `你好，${savedName}`;

                    // 移除 href 屬性，阻止點擊進入登入頁面
                    memberLink.removeAttribute('href');

                    // 修改 CSS 樣式，去除超連結
                    memberLink.style.cursor = 'default';
                    memberLink.style.textDecoration = 'none';

                    // 登出
                    memberLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        // 登出訊息
                        const isLogout = confirm(`您目前已登入（${savedName}）。是否要登出？`);
                        if (isLogout) {
                            // 清除登入的會員資料
                            localStorage.removeItem("userFirstName");
                            localStorage.removeItem("user");

                            alert("已成功登出！");

                            // 重新整理頁面，導覽列會自動恢復成「會員」
                            window.location.reload();
                        }
                    });
                }
            })
            .catch(error => console.error('發生錯誤:', error));
    }
});