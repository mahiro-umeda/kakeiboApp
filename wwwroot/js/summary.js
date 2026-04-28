let pieChart;
let barChart;

async function loadCharts() {

    const res = await fetch("/api/Kakeibo");
    const data = await res.json();

    // ⭐ 月取得
    const selectedMonth = document.getElementById("monthFilter").value;

    let filteredData = data;

    if (selectedMonth) {
        filteredData = data.filter(x => {
            const d = new Date(x.date);
            const y = d.getFullYear();
            const m = ("0" + (d.getMonth() + 1)).slice(-2);
            return `${y}-${m}` === selectedMonth;
        });
    }

    /* ===== 円グラフ ===== */
    const categoryTotals = {};

    filteredData.forEach(x => {
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
                legend: {
                    position: "bottom",
                }
            },
        }
    });

    /* ===== 棒グラフ ===== */
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    filteredData.forEach(x => {
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
                legend: { 
                    position: "top",
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                },
            }
        }
    });
}

//カレンダー
document.addEventListener("DOMContentLoaded", async function () {

    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;

    const res = await fetch("/api/Kakeibo");
    const data = await res.json();
    
    
    const grouped = {};

    data.forEach(x => {
        const date = x.date.substring(0, 10); 

        if (!grouped[date]) {
            grouped[date] = 0;
        }

        if (x.type === "収入") {
            grouped[date] += x.money;
        } else {
            grouped[date] -= x.money;
        }
    });
    const events = Object.keys(grouped).map(date => {
        const total = grouped[date];

        return {
            title: total >= 0 ? `+¥${total}` : `-¥${Math.abs(total)}`,
            date: date,
            color: total >= 0 ? "blue" : "red"
        };
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "ja",
        events: events
    });

    calendar.render();


    loadCharts();
});

