async function loadChart() {

    const res = await fetch("/api/Kakeibo");
    const data = await res.json();

    const categoryTotals = {};
    let total = 0;

    // 支出のみ集計
    data.forEach(x => {

        if (x.type === "支出") {

            const money = Number(x.money);
            total += money;

            if (!categoryTotals[x.category]) {
                categoryTotals[x.category] = 0;
            }

            categoryTotals[x.category] += money;
        }
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const ctx = document.getElementById("pieChart");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0",
                    "#9966ff",
                    "#ff9f40",
                    "#66ff66",
                    "#ff6666"
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

loadChart();