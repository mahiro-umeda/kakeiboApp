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


        // 収支、カテゴリにプルダウン表示
        tr.innerHTML = `   
            <td>${item.date}</td>
            <td>${item.name}</td>

           
          
    <td>
        <select class="form-select form-select-sm"
                onchange="updateType(${item.id}, this.value)">
            <option value="収入" ${item.type === "収入" ? "selected" : ""}>収入</option>
            <option value="支出" ${item.type === "支出" ? "selected" : ""}>支出</option>
        </select>
    </td>

    <!-- カテゴリ -->
    <td>
        <select class="form-select form-select-sm"
                onchange="updateCategory(${item.id},this.value)">
            <option value="家賃" ${item.category?.trim() === "家賃" ? "selected" : ""}>🏠 家賃</option>
            <option value="食費" ${item.category?.trim() === "食費" ? "selected" : ""}>🍎 食費</option>
            <option value="交通費" ${item.category?.trim() === "交通費" ? "selected" : ""}>🚗 交通費</option>
            <option value="光熱費" ${item.category?.trim() === "光熱費" ? "selected" : ""}>💡 光熱費</option>
            <option value="日用品" ${item.category?.trim() === "日用品" ? "selected" : ""}>🛒 日用品</option>
            <option value="給与" ${item.category?.trim() === "給与" ? "selected" : ""}>💰 給与</option>
        </select>
    </td>

    <td class="text-end">${item.money}</td>
    <td>${item.memo || ""}</td>

    <td>
        <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">
            削除
        </button>
    </td>
    `;

        list.appendChild(tr);
    });


     async function updateType(id, value) {
            await fetch(`/api/kakeibo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type: value })
            });

         loadData();
        }

        async function updateCategory(id, value) {
            const res = await fetch(`/api/kakeibo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ category: value })
            });
            loadData();
     }


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