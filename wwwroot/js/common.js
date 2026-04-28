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

// 背景画像アップロード
    function uploadBackgroundImage() {
    const fileInput = document.getElementById('bgFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("画像ファイルを選択してください");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        // 画像データをLocalStorageに保存
        localStorage.setItem('customBgImage', base64Image);
        // 即座に反映
        updateBodyBackground(base64Image);
    };
    reader.readAsDataURL(file); // 画像をデータに変換
}

// 実際にbodyのスタイルを変える共通関数
function updateBodyBackground(imageData) {
    if (imageData) {
        document.body.style.backgroundImage = `url('${imageData}')`;
        document.body.style.backgroundSize = "contain";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    } else {
        document.body.style.backgroundImage = "none";
    }
}

// 背景リセット
function clearBackgroundImage() {
    localStorage.removeItem('customBgImage');
    updateBodyBackground(null);
    document.getElementById('bgFileInput').value = ''; // 入力をクリア
}

// ページ読み込み時に保存された背景があれば適用（全てのページで実行するようにする）
document.addEventListener('DOMContentLoaded', () => {
    const savedBg = localStorage.getItem('customBgImage');
    if (savedBg) {
        updateBodyBackground(savedBg);
    }
});