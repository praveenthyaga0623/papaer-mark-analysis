// ====== Load Data ======
let xData = JSON.parse(localStorage.getItem("xData")) || [];
let yData = JSON.parse(localStorage.getItem("yData")) || [];

// ====== Get CSS Variables ======
const styles = getComputedStyle(document.documentElement);
const colorPrimary = styles.getPropertyValue("--color-primary").trim();
const colorLabel = styles.getPropertyValue("--color-label").trim();
const colorText = styles.getPropertyValue("--color-text").trim();
const fontFamily = styles.getPropertyValue("--font-family").trim();

const F_Pass = "#CC2B52";
const S_Pass = "#074799";
const C_Pass = "#7BD3EA";
const B_Pass = "#FFE31A";
const A_Pass = "#98CD00";

let currentChartType = localStorage.getItem("chartType") || "bar";
const chartTypeSelect = document.getElementById("chartType");
if (chartTypeSelect) chartTypeSelect.value = currentChartType;

let chart;

function initializeChart() {
  const chartOptions = {
    chart: {
      type: currentChartType,
      toolbar: { show: false },
      height: 500,
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "60%",
        borderRadiusApplication: "end",
        colors: {
          ranges: [
            { from: 75, to: 100, color: [A_Pass] },
            { from: 65, to: 74.99, color: [B_Pass] },
            { from: 55, to: 64.99, color: [C_Pass] },
            { from: 35, to: 54.99, color: [S_Pass] },
            { from: 0, to: 34.99, color: [F_Pass] },
          ],
        },
        dataLabels: { position: "top" },
      },
    },
    stroke: {
      show: currentChartType === "line",
      curve: "smooth",
      width: 2,
      colors: ["#007bff"],
    },
    markers: {
      size: 0,
      colors: ["#007bff"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    dataLabels: {
      enabled: currentChartType === "bar",
      position: "top",
      offsetY: -20,
      formatter: (val) => (val === 0 ? "AB" : val === 100 ? "" : val),
      style: {
        fontSize: "10px",
        fontFamily,
        colors: [colorText],
      },
    },
    series: [{ name: "", data: yData }],
    xaxis: {
      categories: xData,
      labels: {
        rotate: -90,
        show: true,
        style: { colors: colorText, fontFamily },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        show: true,
        style: { colors: colorText, fontFamily },
      },
      axisBorder: { show: false },
    },
    colors: [colorPrimary],
    grid: { show: true, borderColor: ["#22222211"] },
    tooltip: {
      enabled: true,
      followCursor: false,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const paperNo = xData[dataPointIndex];
        const marks = yData[dataPointIndex];
        return `
          <div style="padding: 5px 10px; background: #fff; color: #333;">
            <b>Paper No. </b>${paperNo}<br>
            <b>Marks </b>${marks}%
          </div>`;
      },
    },
  };

  if (window.innerWidth < 900) {
    chartOptions.xaxis.labels.style.fontSize = "6px";
    chartOptions.yaxis.labels.style.fontSize = "8px";
    chartOptions.dataLabels.enabled = false;
  }

  if (chart) chart.destroy();
  chart = new ApexCharts(document.querySelector(".area-chart"), chartOptions);
  chart.render();
}

document.addEventListener("DOMContentLoaded", initializeChart);

function updatePopupCountdown() {
  const examDate = new Date("2025-11-10T00:00:00");
  const now = new Date();
  const diffTime = examDate.getTime() - now.getTime();
  const popupDaysEl = document.getElementById("popup-days");
  const popupTimeEl = document.getElementById("popup-time");
  if (!popupDaysEl || !popupTimeEl) return;

  if (diffTime <= 0) {
    popupDaysEl.textContent = "Exam is over.";
    popupTimeEl.textContent = "";
    return;
  }

  const totalMinutes = Math.floor(diffTime / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  popupDaysEl.textContent = `${days} days left`;
  popupTimeEl.textContent = `Around ${hours} hours and ${minutes} minutes remaining`;
}

function closePopup() {
  document.getElementById("examPopup").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("popupShown")) {
    document.getElementById("examPopup").style.display = "flex";
    sessionStorage.setItem("popupShown", "true");
    updatePopupCountdown();
    setInterval(updatePopupCountdown, 60000);
  }
});

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

if (darkmode === "active") enableDarkmode();

if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode");
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("myButton")?.click();
  }
});

function updateChart() {
  chart.updateOptions({
    series: [{ data: yData }],
    xaxis: { categories: xData },
  });
  localStorage.setItem("xData", JSON.stringify(xData));
  localStorage.setItem("yData", JSON.stringify(yData));
  renderList();
}

function changeChartType() {
  const selectedType = document.getElementById("chartType").value;
  currentChartType = selectedType;
  localStorage.setItem("chartType", selectedType);
  initializeChart();
}

function addData() {
  const xInput = document.getElementById("xValue");
  const yInput = document.getElementById("yValue");

  const xVal = xInput.value.trim();
  const yVal = parseFloat(yInput.value);

  if (xVal && !isNaN(yVal) && yVal >= 0 && yVal <= 100) {
    xData.push(xVal);
    yData.push(yVal);
    updateChart();
    xInput.value = "";
    yInput.value = "";
  } else {
    alert("Please enter valid X and Y values (Y should be 0–100).");
  }
}

function renderList() {
  const list = document.getElementById("dataList");
  list.innerHTML = "";

  xData.forEach((x, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="renderlist">
        <div><b>P${x}</b></div>
        <div>${yData[i]}</div>
        <div><button class="edit" onclick="editData(${i})"><i class='bx bx-edit'></i></button></div>
        <div><button class="del" onclick="deleteData(${i})"><i class='bx bx-trash'></i></button></div>
      </div>`;
    list.appendChild(li);
  });
}

function editData(index) {
  const newX = prompt("Enter new X value:", xData[index]);
  const newY = prompt("Enter new Y value:", yData[index]);

  if (newX !== null && newY !== null && !isNaN(parseFloat(newY))) {
    xData[index] = newX;
    yData[index] = parseFloat(newY);
    updateChart();
  }
}

function deleteData(index) {
  xData.splice(index, 1);
  yData.splice(index, 1);
  updateChart();
}

renderList();
