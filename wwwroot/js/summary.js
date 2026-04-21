asylet pieChart;
let barChart;

/* メニュー */
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".menu-btn");

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
    }
});

/* グラフ */
async function loadCharts() {

    const res = await fetch("/api/Kakeibo");
    const data = await res.json();

    /* 円グラフ */
    const categoryTotals = {};

    data.forEach(x => {
        if (x.type === "支出") {
            const money = Number(x.money);

            if (!categoryTotals[x.category]) {
                categoryTotals[x.category] = 0;
            }

            categoryTotals[x.category] += money;
        }
    });

    const pieLabels = Object.keys(categoryTotals);
    const pieValues = Object.values(categoryTotals);

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieValues,
                backgroundColor: [
                    "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0",
                    "#9966ff", "#ff9f40", "#66ff66", "#ff6666"
                ]
            }]
        },
        options: {
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

    /* 棒グラフ */
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    data.forEach(x => {
        const date = new Date(x.date);
        const month = date.getMonth();
        const money = Number(x.money);

        if (x.type === "収入") {
            monthlyIncome[month] += money;
        } else {
            monthlyExpense[month] += money;
        }
    });

    const labels = [
        "1月", "2月", "3月", "4月", "5月", "6月",
        "7月", "8月", "9月", "10月", "11月", "12月"
    ];

    if (barChart) barChart.destroy();

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "収入",
                    data: monthlyIncome,
                    backgroundColor: "#36a2eb"
                },
                {
                    label: "支出",
                    data: monthlyExpense,
                    backgroundColor: "#ff6384"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/* 実行 */
loadCharts();