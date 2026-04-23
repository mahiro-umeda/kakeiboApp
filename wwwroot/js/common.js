// 開閉
function toggleMenu() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    menu.style.display =
        (menu.style.display === "block") ? "none" : "block";
}

// 外クリックで閉じる（追加）
document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".menu-btn");

    if (!menu || !btn) return;

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
    }
});

// フォント変更
const fontSelect = document.getElementById("fontSelect");

if (fontSelect) {

    // 保存されたフォント読み込み
    const savedFont = localStorage.getItem("font");
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
        fontSelect.value = savedFont;
    }

    // 変更時
    fontSelect.addEventListener("change", function () {
        const font = this.value;
        document.body.style.fontFamily = font;

        // 保存
        localStorage.setItem("font", font);
    });
}

// ⭐ フォームがあるページだけ動くようにする
const form = document.getElementById("Add");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            money: parseInt(document.getElementById("money").value),
            type: document.getElementById("type").value,
            type2: document.getElementById("type2")?.value || "",
            date: document.getElementById("date").value,
            memo: document.getElementById("memo").value
        };

        // POST（保存）
        await fetch("/api/kakeibo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // 再読み込み（必要なページだけ）
        if (typeof loadData === "function") {
            loadData();
        }
    });
}

async function loadData() {

    const container = document.getElementById("list");
    if (!container) return; // ⭐ 他ページでエラー防止

    const res = await fetch("/api/kakeibo");
    const data = await res.json();

    console.log(data);

    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `${item.name} ${item.money}円`;
        container.appendChild(div);
    });
}

// ⭐ listがあるページだけ実行
if (document.getElementById("list")) {
    loadData();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. ダークモードの復元
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    const switchBtn = document.getElementById('darkModeSwitch');
    if (switchBtn) switchBtn.checked = isDark;

    // 2. アクセントカラー（テーマ）の復元
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }

    // 3. フォントの復元
    const savedFont = localStorage.getItem("font");
    const fontSelect = document.getElementById("fontSelect");
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
        if (fontSelect) fontSelect.value = savedFont;
    }
});

// ダークモード切替関数
function toggleDarkMode() {
    const switchBtn = document.getElementById('darkModeSwitch');
    const isDark = switchBtn.checked;
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDark);
}



/** * 画面遷移しても状態を維持するための処理
 */
/*document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const switchBtn = document.getElementById('darkModeSwitch');

    if (isDark) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        if (switchBtn) switchBtn.checked = true;
    }
});

//テーマカラー変更
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;

        document.body.setAttribute("data-theme", theme);
    });
});

// 設定画面のボタンにクリックイベントをつける
document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        let selectedColor = '#0d6efd'; // デフォルト

        // ボタンのデータに合わせて色を振り分ける
        if (theme === 'vivid') selectedColor = '#ff0000';      // ビビッド（赤例）
        if (theme === 'pastel') selectedColor = '#ffb7c5';     // パステル（ピンク例）
        if (theme === 'lightblue') selectedColor = '#7fbfff';  // パステルブルー

        // 1. 画面に即時反映
        applyAccentColor(selectedColor);
        // 2. localStorageに保存（画面遷移しても消えないように）
        localStorage.setItem('accentColor', selectedColor);
    });
});

// 実際にCSS変数を書き換える関数（common.jsに置いておくと全画面で使い回せます）
function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. アクセントカラーの復元 ---
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        // bodyに属性をセットしてCSS変数を発動させる
        document.body.setAttribute('data-theme', savedTheme);
    }

    // --- 2. ダークモードの復元 ---
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

    const switchBtn = document.getElementById('darkModeSwitch');
    if (switchBtn) {
        switchBtn.checked = isDark;
    }
});*/