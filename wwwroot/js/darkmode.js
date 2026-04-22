const body = document.querySelector('body');
const darkmodeBtn = document.getElementById('darkmodeBtn');

var mode = localStorage.getItem('mode');
if (mode === 'dark') {
    body.classList.add('dark');
}

darkmodeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (mode === 'normal') {
        localStorage.setItem('mode', 'dark');
        mode = 'dark';
    } else {
        localStorage.setItem('mode', 'normal');
        mode = 'normal';
    }
});

// デバイスの設定がダークモードかどうか
const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (isDarkMode) {
    // HTML要素に.darkを追加
    rootEl.classList.add("dark");
    // トグルボタンをcheckedに
    btn.checked = true;
} else {
    // HTML要素から.darkを削除
    rootEl.classList.remove("dark");
    btn.checked = false;
}