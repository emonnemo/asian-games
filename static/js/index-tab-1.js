var indonesiaBubbleChart;
var indonesiaYearDonutChart;
var activeBubble;

const ACTIVE_COLOR = "rgb(187, 52, 49)";
const NORMAL_COLOR = "rgb(201, 201, 201)";
const HOVER_COLOR = "rgb(151, 151, 151)";

// Functions to load data from APIs using AJAX
function loadIndonesiaMedals() {
  const containerHeight = $(".tab-content").innerHeight();
  console.log(containerHeight);
  $.get(format("/dashboard/api/get-indonesia-medals"), function(data) {
    const xAxis = $.map(data.years, function(v, i) {
      return parseInt(i);
    });
    var indonesiaBubbleChartOptions = {
      chart: {
        height: containerHeight * 0.7,
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
      colors: [NORMAL_COLOR],
      series: [
        {
          data: data.series
        }
      ],
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 1
          }
        },
        active: {
          filter: {
            type: "normal",
            value: 1
          }
        }
      },
      fill: {
        opacity: 1
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
        y: {
          title: {
            formatter: function() {
              return "Peringkat";
            }
          }
        },
        z: {
          formatter: function(
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            return Math.round(value * value);
          },
          title: "Total medali:"
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
    setBubbleDisplayFunction();
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
        ],
        tooltip: {
          enabled: true,
          y: {
            formatter: function(
              value,
              { series, seriesIndex, dataPointIndex, w }
            ) {
              return parseInt(value) + " medali";
            }
          }
        }
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
function setBubbleDisplayFunction() {
  var bubbles = $(".apexcharts-series-markers.apexcharts-series-bubble circle");
  bubbles.hover(function() {
    if (this.style.fill !== ACTIVE_COLOR) {
      this.style.fill = HOVER_COLOR;
    }
  });
  bubbles.mouseleave(function() {
    if (this.style.fill === HOVER_COLOR) {
      this.style.fill = NORMAL_COLOR;
    }
  });
  bubbles.click(function() {
    if (activeBubble) {
      activeBubble.style.fill = NORMAL_COLOR;
    }
    this.style.fill = ACTIVE_COLOR;
    activeBubble = this;
  });
  bubbles.last()[0].dispatchEvent(new Event("click"));
}
