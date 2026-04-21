async function loadData() {

    const res = await fetch("/api/kakeibo");
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

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
    loadData();
}

loadData();