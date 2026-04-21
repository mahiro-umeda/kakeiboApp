// JavaScript source code

//サマリー
async function loadSummary() {
    try {
        const res = await fetch("/api/Kakeibo");

        if (!res.ok) {
            throw new Error("APIエラー");
        }

        const data = await res.json();
        console.log(data);

        let income = 0;
        let expense = 0;

        data.forEach(x => {
            const money = Number(x.money) || 0;
            const type = (x.type || "").trim();

            if (type === "収入") {
                income += money;
            } else if (type === "支出") {
                expense += money;
            }
        });

        document.getElementById("income").innerText = income;
        document.getElementById("expense").innerText = expense;
        document.getElementById("balance").innerText = income - expense;

    } catch (e) {
        console.error(e);
        alert("エラーが発生しました");
    }
}

loadSummary();