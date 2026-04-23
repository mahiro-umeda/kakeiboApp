<<<<<<< HEAD
﻿async function loadData() {

    const res = await fetch("/api/kakeibo");
=======
// JavaScript source code
//検索
async function loadData() {
    const params = new URLSearchParams();

    const type = document.getElementById("searchType").value;
    const cat = document.getElementById("searchCategory").value;
    const s = document.getElementById("startDate").value;
    const e = document.getElementById("endDate").value;

    if (type) params.append("type", type);
    if (cat) params.append("category", cat);
    if (s) params.append("startDate", s);
    if (e) params.append("endDate", e);

    const res = await fetch("/api/Kakeibo?" + params.toString());
>>>>>>> main
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

<<<<<<< HEAD
    let totalIncome = 0;
    let totalExpense = 0;

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const searchType = document.getElementById("searchType").value;
    const searchCategory = document.getElementById("searchCategory").value;

    data.forEach(item => {

        if (startDate && item.date < startDate) return;
        if (endDate && item.date > endDate) return;
        if (searchType && item.type !== searchType) return;
        if (searchCategory && item.category !== searchCategory) return;

        if (item.type === "収入") {
            totalIncome += item.money;
        } else {
            totalExpense += item.money;
        }

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.money}</td>
            <td>${item.memo || ""}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">
                    削除
                </button>
            </td>
        `;

        list.appendChild(tr);
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;

    const balance = totalIncome - totalExpense;
    const balanceEl = document.getElementById("balance");
    balanceEl.textContent = balance;

    // ⭐ 色変化
    if (balance >= 0) {
        balanceEl.style.color = "#36a2eb";
    } else {
        balanceEl.style.color = "#ff6384";
    }
}

async function deleteData(id) {
    await fetch(`/api/kakeibo/${id}`, {
        method: "DELETE"
    });
=======
    data.forEach(x => {
        list.innerHTML += `
<tr>
<td>${x.date}</td>
<td>${x.name}</td>
<td>${x.type}</td>
<td>${x.category}</td>
<td>${x.money}</td>
<td>${x.memo}</td>
<td><button class="btn btn-danger btn-sm" onclick="del(${x.id})">削除</button></td>
</tr>`;
    });
}

//削除
async function del(id) {
    if (!confirm("削除する？")) return;
    await fetch("/api/Kakeibo/" + id, { method: "DELETE" });
>>>>>>> main
    loadData();
}

loadData();