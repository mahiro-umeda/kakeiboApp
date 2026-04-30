
async function loadData(sortAsc = false) {
    const res = await fetch(`/api/kakeibo?sortAsc=${sortAsc}`);
    const data = await res.json();

    data.sort((a, b) => {
        if (sortAsc) {
            return new Date(a.date) - new Date(b.date);
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });


    const list = document.getElementById("list");
    list.innerHTML = "";  //前の表示データを全て消す

    let totalIncome = 0;
    let totalExpense = 0;

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const searchType = document.getElementById("searchType").value;
    const searchCategory = document.getElementById("searchCategory").value;

    data.forEach(item => {
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && itemDate < start) return;
        if (end && itemDate > end) return;

        if (item.type === "収入") {
            totalIncome += item.money;
        } else {
            totalExpense += item.money;
        }

        const tr = document.createElement("tr");
        tr.id = `row-${item.id}`;

        // ポイント：各項目を個別の <td> で囲み、全角スペースを削除
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.money.toLocaleString()}</td>
            <td>${item.memo || ""}</td>
            <td>
                <div class="d-flex gap-1 justify-content-start">
                    <button class="btn btn-warning btn-sm" onclick="editMode(${item.id})">編集</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">削除</button>
                </div>
            </td>
        `;
        list.appendChild(tr);
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;

    const balance = totalIncome - totalExpense;
    const balanceEl = document.getElementById("balance");
    balanceEl.textContent = balance;

    if (balance >= 0) {
        balanceEl.style.color = "#36a2eb";
    } else {
        balanceEl.style.color = "#ff6384";
    }
}

// ポイント：editMode と updateData は loadData の「外」に出す
//id を引数として、編集ボタンを押すと、そのidの行だけ、編集対象とする
function editMode(id) {
    const tr = document.getElementById(`row-${id}`);
    const cells = tr.getElementsByTagName("td");

    //cells[0]は日付
    const date = cells[0].innerText;   //日付
    const name = cells[1].innerText;   //内容
    const type = cells[2].innerText;   //収入or支出
    const category = cells[3].innerText; //カテゴリ
    const money = cells[4].innerText.replace(/,/g, ''); // カンマを除去して取得
    const memo = cells[5].innerText;

    //編集モードのHTMLに切り替え

    cells[0].innerHTML = `<input type="date" id="edit-date-${id}" class="form-control form-control-sm" value="${date}">`;
    cells[1].innerHTML = `<input type="text" id="edit-name-${id}" class="form-control form-control-sm" value="${name}">`;  //  .innerHTML =新しいHTMLに書き換え
    cells[2].innerHTML = `
        <select id="edit-type-${id}" class="form-select form-select-sm">
            <option value="支出" ${type === '支出' ? 'selected' : ''}>支出</option>
            <option value="収入" ${type === '収入' ? 'selected' : ''}>収入</option>
        </select>`;
    cells[3].innerHTML = `
        <select id="edit-category-${id}" class="form-select form-select-sm"  >
            <option value="🏠家賃" ${category.includes('🏠家賃') ? 'selected' : ''}>🏠 家賃</option>
            <option value="🍎食費" ${category.includes('🍎食費') ? 'selected' : ''}>🍎 食費</option>
            <option value="🚗交通費" ${category.includes('🚗交通費') ? 'selected' : ''}>🚗 交通費</option>
            <option value="💡光熱費" ${category.includes('💡光熱費') ? 'selected' : ''}>💡 光熱費</option>
            <option value="🛒日用品" ${category.includes('🛒日用品') ? 'selected' : ''}>🛒 日用品</option>
            <option value="🏥医療費" ${category.includes('🏥医療費') ? 'selected' : ''}>🏥 医療費</option>
            <option value="💰給与" ${category.includes('💰給与') ? 'selected' : ''}>💰 給与</option>
        </select>`;
    cells[4].innerHTML = `<input type="number" id="edit-money-${id}" class="form-control form-control-sm" value="${money}">`;
    cells[5].innerHTML = `<textarea id="edit-memo-${id}" class="form-control form-control-sm" rows="2">${memo}</textarea>`;
    cells[6].innerHTML = `
        <div class="d-flex gap-1 justify-content-end">
            <button class="btn btn-success btn-sm" onclick="updateData(${id})">保存</button>
            <button class="btn btn-secondary btn-sm" onclick="loadData()">取消</button>
        </div>
    `;
}

async function updateData(id) {
    // input要素から最新の入力値を取得するように修正
    const tr = document.getElementById(`row-${id}`);
    const updatedData = {
        id: id,
        name: document.getElementById(`edit-name-${id}`).value, 
        type: document.getElementById(`edit-type-${id}`).value,
        category: document.getElementById(`edit-category-${id}`).value,
        money: Number(document.getElementById(`edit-money-${id}`).value),
        date: document.getElementById(`edit-date-${id}`).value,
        memo: document.getElementById(`edit-memo-${id}`).value
    };

    const res = await fetch(`/api/kakeibo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        loadData();   //一覧を再読み込みして編集モードを解除
    } else {
        alert("更新に失敗しました");
    }
}

async function deleteData(id) {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/kakeibo/${id}`, { method: "DELETE" });
    loadData();
}

loadData();