 

 // ====== Load Data ======
  let xData = JSON.parse(localStorage.getItem("xData")) || [];
  let yData = JSON.parse(localStorage.getItem("yData")) || [];

  // ====== Get CSS Variables ======
  const styles = getComputedStyle(document.documentElement);
  const colorPrimary = styles.getPropertyValue("--color-primary").trim();
  const colorLabel = styles.getPropertyValue("--color-label").trim();
  const colorText = styles.getPropertyValue("--color-text").trim();
  const fontFamily = styles.getPropertyValue("--font-family").trim();

// Rotate X-axis labels if screen width is less than 900px


 
  // ====== Chart Configuration ======
  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      height: 500,
      background: "transparent",
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "60%",
        borderRadiusApplication: "end",
        
        colors: {
          ranges: [
            { from: 75, to: 100, color: "#5CB338" },
            { from: 65, to: 74.99, color: "#074799" },
            { from: 55, to: 64.99, color: "#7BD3EA" },
            { from: 35, to: 54.99, color: "#FFE31A" },
            { from: 0, to: 34.99, color: "#CC2B52" },
          ],
        },
        dataLabels: {
      position: "top" ,
      // <-- this is the key to push labels above the bars
    },
    
      },
    },
    dataLabels: {
  enabled: true,
  position: 'top',
  offsetY: -20,
  formatter: function (val) {
    return val + ""; // Example: add a % symbol
  },
  formatter: function (val) {
    return val === 0 ? "" : val;
  },
  style: {

    fontSize: '10px',
    fontFamily: fontFamily,
    colors: [colorText]
  }
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
    grid: {
      show: true,
      borderColor: colorText,
    },
    tooltip: {
      enabled: false,
      followCursor: false,
      custom: ({ series, seriesIndex, dataPointIndex }) => `
        <div style="padding: 1px 5px; color: #333; background: #eee; border-radius: 4px;">
          <strong>${series[seriesIndex][dataPointIndex]}%</strong>
        </div>`,
    },
  };
 if (window.innerWidth < 900) {
  chartOptions.xaxis.labels.style.fontSize = "6px";
  chartOptions.yaxis.labels.style.fontSize = "8px";
  chartOptions.dataLabels.style.fontSize = "0px";
}

  // ====== Create and Render Chart ======
  const chart = new ApexCharts(document.querySelector(".area-chart"), chartOptions);
  chart.render();


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

      const totalMinutes = Math.floor(diffTime / (1000 * 60));
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

        updatePopupCountdown(); // Initial call
        setInterval(updatePopupCountdown, 60000); // Every 1 min
      }
    });

// ===================dark /light theme=================

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})


  // ====== Chart Data Update ======
  function updateChart() {
    chart.updateOptions({
      series: [{ data: yData }],
      xaxis: { categories: xData },
    });
    localStorage.setItem("xData", JSON.stringify(xData));
    localStorage.setItem("yData", JSON.stringify(yData));
    renderList();
  }

  // ====== Add New Data ======
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

  // ====== Render Data List ======
  function renderList() {
    const list = document.getElementById("dataList");
    list.innerHTML = "";

    xData.forEach((x, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="renderlist">
          <div><b>P${x}</b></div>
          <div>${yData[i]}</div>          
          <div><button class="edit" onclick="editData(${i})"><i class='bx  bx-edit'  ></i> </button></div> 
          <div><button class="del" onclick="deleteData(${i})"><i class='bx  bx-trash'  ></i> </button></div> 
        </div>`;
      list.appendChild(li);
    });
  }

  // ====== Edit Existing Data ======
  function editData(index) {
    const newX = prompt("Enter new X value:", xData[index]);
    const newY = prompt("Enter new Y value:", yData[index]);

    if (newX !== null && newY !== null && !isNaN(parseFloat(newY))) {
      xData[index] = newX;
      yData[index] = parseFloat(newY);
      updateChart();
    }
  }

  // ====== Delete Data Point ======
  function deleteData(index) {
    xData.splice(index, 1);
    yData.splice(index, 1);
    updateChart();
  }

  

  // ====== Initial Call ======
  renderList();

