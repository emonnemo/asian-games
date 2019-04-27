var indonesiaBubbleChart;

// Functions to load data from APIs using AJAX
function loadIndonesiaMedals() {
  $.get(format("/dashboard/api/get-indonesia-medals"), function(data) {
    var indonesiaBubbleChartOptions = {
      chart: {
        height: 350,
        type: "bubble"
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: data.series
        }
      ],
      fill: {
        opacity: 0.8
      },
      title: {
        text: "Indonesia in Asian Games"
      },
      xaxis: {
        min: 1978,
        max: 2022,
        minHeight: 1000,
        tickAmount: data.years.length + 1,
        categories: data.years,
        title: {
          text: "Tahun Event"
        },
        labels: {
          formatter: function(value) {
            if (value === 2022 || value === 1978)
              return ".";
            return value;
          },
        },
      },
      tooltip: {
        enabled: true,
        z: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            return Math.round(value * value);
          },
        },
      },
      yaxis: {
        title: {
          text: "Peringkat"
        },
        min: 1,
        max: data.lowestRank + 2,
        reversed: true
      }
    };
    indonesiaBubbleChart = new ApexCharts(
      document.querySelector("#indonesia-bubble-chart"),
      indonesiaBubbleChartOptions
    );

    indonesiaBubbleChart.render();
  });
}
window.onload = function() {
  loadIndonesiaMedals();
};
