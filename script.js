// ====== Load Data ======
let xData = JSON.parse(localStorage.getItem("xData")) || [];
let yData = JSON.parse(localStorage.getItem("yData")) || [];

// ====== Get CSS Variables ======
const styles = getComputedStyle(document.documentElement);
// Ensure these CSS variables are defined in style1.css or provide fallback
const colorPrimary = styles.getPropertyValue("--color-primary") ? styles.getPropertyValue("--color-primary").trim() : '#007bff'; // Fallback
const colorLabel = styles.getPropertyValue("--color-label") ? styles.getPropertyValue("--color-label").trim() : '#505050'; // Fallback
const colorText = styles.getPropertyValue("--color-text") ? styles.getPropertyValue("--color-text").trim() : '#505050'; // Fallback
const fontFamily = styles.getPropertyValue("--font-family") ? styles.getPropertyValue("--font-family").trim() : 'Poppins, sans-serif'; // Fallback


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
      toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: false
      },
      autoSelected: 'zoom'
    },
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
    const examPopup = document.getElementById("examPopup");
    if (examPopup) { // Check if the element exists before trying to access its style
      examPopup.style.display = "flex";
      sessionStorage.setItem("popupShown", "true");
      updatePopupCountdown();
      setInterval(updatePopupCountdown, 60000);
    }
  }
});

let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
  // Re-initialize chart to apply new theme colors
  initializeChart();
};

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
  // Re-initialize chart to apply new theme colors
  initializeChart();
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
    alert("Please enter valid Paper No. and Marks (Marks should be 0–100).");
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
  const newX = prompt("Enter new Paper No.:", xData[index]);
  const newY = prompt("Enter new Marks:", yData[index]);

  if (newX !== null && newY !== null) {
    const parsedY = parseFloat(newY);
    if (!isNaN(parsedY) && parsedY >= 0 && parsedY <= 100) {
      xData[index] = newX.trim();
      yData[index] = parsedY;
      updateChart();
    } else {
      alert("Invalid Marks. Marks should be between 0 and 100.");
    }
  }
}

function deleteData(index) {
  if (confirm("Are you sure you want to delete this data point?")) {
    xData.splice(index, 1);
    yData.splice(index, 1);
    updateChart();
  }
}

// Function to export data
function exportData() {
  const dataToExport = {
    xData: xData,
    yData: yData,
  };
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "paper_marks_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function clearAllData() {
  if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
    xData = [];
    yData = [];
    updateChart();
    alert("All data has been cleared!");
  }
}

// Function to import data
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (importedData.xData && Array.isArray(importedData.xData) &&
          importedData.yData && Array.isArray(importedData.yData) &&
          importedData.xData.length === importedData.yData.length) {
        xData = importedData.xData;
        yData = importedData.yData;
        updateChart();
        alert("Data imported successfully!");
      } else {
        alert("Invalid data format in the imported file. Please ensure it contains 'xData' and 'yData' arrays of equal length.");
      }
    } catch (error) {
      alert("Error parsing imported file. Please ensure it's a valid JSON file.");
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
  // Clear the input so the same file can be selected again
  event.target.value = null;
}


renderList();