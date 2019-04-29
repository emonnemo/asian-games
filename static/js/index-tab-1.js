var indonesiaBubbleChart;
var indonesiaYearDonutChart;

// Functions to load data from APIs using AJAX
function loadIndonesiaMedals() {
  $.get(format("/dashboard/api/get-indonesia-medals"), function(data) {
    const xAxis = $.map(data.years, function(v, i) {
      return parseInt(i);
    });
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
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#d60000"],
      series: [
        {
          data: data.series
        }
      ],
      states: {
        normal: {
          filter: {
            type: "desaturate"
          }
        },
        hover: {
          filter: {
            type: "darken",
            value: 1
          }
        },
        active: {
          filter: {
            type: "darken"
          }
        }
      },
      fill: {
        opacity: 0.8
      },
      xaxis: {
        min: xAxis[0] - 1,
        max: xAxis[xAxis.length - 1] + 1,
        minHeight: 1000,
        tickAmount: data.years.length + 1,
        categories: xAxis,
        title: {
          text: "Tahun Event"
        },
        labels: {
          formatter: function(value) {
            if (value === xAxis[0] - 1 || value === xAxis[xAxis.length - 1] + 1)
              return ".";
            return data.years[value];
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
    $("#asian-games-yearly-logo").fadeIn(1000);
  });
}
function loadIndonesiaYearlyMedals(year) {
  $.get(
    format("/dashboard/api/get-indonesia-yearly-medals?year=%s", year),
    function(data) {
      var indonesiaYearDonutChartOptions = {
        chart: {
          type: "donut"
        },
        legend: {
          show: false
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
        series: data.series
      };
      $("#chosen-year-indonesia-bubble-chart").html(year);
      const newSrc = $("#asian-games-yearly-logo")
        .attr("src")
        .replace(/[\d]+/i, year);
      $("#asian-games-yearly-logo").attr("src", newSrc);
      indonesiaYearDonutChart.updateOptions(indonesiaYearDonutChartNewOptions);
    }
  );
}

window.onload = function() {
  loadIndonesiaMedals();
  loadIndonesiaYearlyMedals(2018);
};
