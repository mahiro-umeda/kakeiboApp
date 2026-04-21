// JavaScript source code

//メニュー
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

//api
document.getElementById("Add").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        money: parseInt(document.getElementById("money").value),
        type: document.getElementById("type").value,
        type2: document.getElementById("type2").value,
        date: document.getElementById("date").value,
        memo: document.getElementById("memo").value
    };

    // POST（保存）
    await fetch("/api/kakeibo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    // 更新表示
    loadData();
});


// GET（一覧取得）
async function loadData() {
    const res = await fetch("/api/kakeibo");
    const data = await res.json();

    console.log(data); //配列出れば正解

    const container = document.getElementById("list");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `${item.name} ${item.money}円`;
        container.appendChild(div);
    });
}

// ページが読み込まれた瞬間に実行
window.addEventListener('DOMContentLoaded', () => {
    // 1. ダークモードの復元
    const isDark = localStorage.getItem('darkMode') === 'true';
    const html = document.documentElement;
    const switchBtn = document.getElementById('darkModeSwitch');

    if (isDark) {
        html.setAttribute('data-bs-theme', 'dark');
        if (switchBtn) switchBtn.checked = true;
    }

    // 2. カスタムカラーの復元
    const savedColor = localStorage.getItem('themeColor') || '#0d6efd';
    applyThemeColor(savedColor);

    // カラーピッカーの初期値も保存された色に合わせる
    const picker = document.getElementById('colorPicker');
    if (picker) picker.value = savedColor;
});

// ダークモード切り替え
function toggleDarkMode() {
    const html = document.documentElement;
    const isChecked = document.getElementById('darkModeSwitch').checked;

    if (isChecked) {
        html.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        html.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('darkMode', 'false');
    }
}

// カラーピッカー変更時
function changeTheme(color) {
    applyThemeColor(color);
    localStorage.setItem('themeColor', color); // 保存
}

// 実際に色を適用する関数
function applyThemeColor(color) {
    // CSS変数を書き換える
    document.documentElement.style.setProperty('--main-theme-color', color);
}


// 初期表示
loadData();

