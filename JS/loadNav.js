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

                // 如果是子頁面，自動把選單裡的連結補上 ../ 避免跳轉 404
                if (isInPagesFolder) {
                    const links = placeholder.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('../')) {
                            link.setAttribute('href', '../' + href);
                        }
                    });

                    // 自動修正 Logo 圖片路徑
                    const logoImg = placeholder.querySelector('.navlogo');
                    if (logoImg) {
                        const src = logoImg.getAttribute('src');
                        if (src && !src.startsWith('http') && !src.startsWith('../')) {
                            logoImg.setAttribute('src', '../' + src);
                        }
                    }
                }
            })
            .catch(error => console.error('發生錯誤:', error));
    }
});