var indonesiaBubbleChart;
var indonesiaYearDonutChart;

// Functions to load data from APIs using AJAX
function loadIndonesiaMedals() {
  $.get(format("/dashboard/api/get-indonesia-medals"), function(data) {
    var indonesiaBubbleChartOptions = {
      title: {
        text: "Indonesia in Asian Games"
      },
      chart: {
        height: 700,
        type: "bubble",
        events: {
          dataPointSelection: function(event, chartContext, config) {
            updateIndonesiaYearlyMedals(data.years[config.dataPointIndex]);
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: data.series
        }
      ],
      colors: ["#c8c8c8"],
      fill: {
        opacity: 0.8
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
            if (value === 2022 || value === 1978) return ".";
            return value;
          }
        }
      },
      tooltip: {
        enabled: true,
        z: {
          formatter: function(
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            return Math.round(value * value);
          }
        }
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
function loadIndonesiaYearlyMedals(year) {
  $.get(
    format("/dashboard/api/get-indonesia-yearly-medals?year=%s", year),
    function(data) {
      var indonesiaYearDonutChartOptions = {
        title: {
          text: "Medali Indonesia di Event Tahun " + year
        },
        chart: {
          type: "donut"
        },
        series: data.series,
        labels: ["Emas", "Perak", "Perunggu"],
        colors: ["#e1ca60", "#d3d3d1", "#cc8b4b"],
        fill: {
          type: "gradient",
          gradient: {
            colorStops: [
              [
                {
                  offset: 80,
                  color: "#e1ca60",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: "#bc9631",
                  opacity: 1
                }
              ],
              [
                {
                  offset: 80,
                  color: "#d3d3d1",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: "#8e8e8e",
                  opacity: 1
                }
              ],
              [
                {
                  offset: 80,
                  color: "#cc8b4b",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: "#aa6321",
                  opacity: 1
                }
              ]
            ],
            stops: [0, 70, 100]
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };

      indonesiaYearDonutChart = new ApexCharts(
        document.querySelector("#indonesia-year-donut-chart"),
        indonesiaYearDonutChartOptions
      );

      indonesiaYearDonutChart.render();
    }
  );
}

function updateIndonesiaYearlyMedals(year) {
  $.get(
    format("/dashboard/api/get-indonesia-yearly-medals?year=%s", year),
    function(data) {
      var indonesiaYearDonutChartNewOptions = {
        title: {
          text: "Medali Indonesia di Event Tahun " + year
        },
        series: data.series
      };

      indonesiaYearDonutChart.updateOptions(indonesiaYearDonutChartNewOptions);
    }
  );
}

window.onload = function() {
  loadIndonesiaMedals();
  loadIndonesiaYearlyMedals(2018);
};
