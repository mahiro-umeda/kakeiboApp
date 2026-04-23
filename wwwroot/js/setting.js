// JavaScript source code
document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');

        // bodyの属性を書き換え（これで現在の画面の色が変わる）
        document.body.setAttribute('data-theme', theme);

        // localStorageに保存（これで他の画面に引き継げる）
        localStorage.setItem('selectedTheme', theme);

        console.log("テーマを保存しました:", theme);
    });
});

// ページ読み込み時に保存されたテーマを適用
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
});