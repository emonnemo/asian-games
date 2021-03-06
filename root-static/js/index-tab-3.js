let selectionSportChart;

function loadIndonesiaSportSummaryChart() {
  const containerHeight = $(".tab-content").innerHeight();
  $.get(format("/dashboard/api/get-indonesia-sport-summary/"), function(data) {
    var indonesiaSportSummaryChartOptions = {
      chart: {
        height: containerHeight * 0.5,
        type: "pie",
        events: {
          dataPointSelection: function(event, chartContext, config) {
            console.log(data.labels[config.dataPointIndex]);
            updateSelectionSportChart(data.labels[config.dataPointIndex]);
          }
        }
      },
      legend: {
        position: "bottom"
      },
      series: data.series,
      labels: data.labels,
      colors: ["#ffe4c4", "#ffa7a7", "#ffc4ae"],
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
        y: {
          formatter: function(
            value,
            { series, seriesIndex, dataPointIndex, w }
          ) {
            return Math.round(value * data.total) + " medali";
          }
        }
      }
    };

    indonesiaSportSummaryChart = new ApexCharts(
      document.querySelector("#indonesia-sport-chart"),
      indonesiaSportSummaryChartOptions
    );

    indonesiaSportSummaryChart.render();
  });
}
function loadSelectionSportChart(event) {
  const containerHeight = $(".tab-content").innerHeight();
  $.get(
    format("/dashboard/api/get-indonesia-sport-medals?event=%s", event),
    function(data) {
      var selectionChartOptions = {
        chart: {
          height: containerHeight * 0.5,
          type: "bar",
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        series: data.series,
        colors: ["#e1ca60", "#d3d3d1", "#cc8b4b"],
        xaxis: {
          categories: data.sports
        },
        tooltip: {},
        fill: {
          opacity: 1
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          offsetX: 40
        }
      };

      selectionSportChart = new ApexCharts(
        document.querySelector("#selection-sport-chart"),
        selectionChartOptions
      );

      selectionSportChart.render();
    }
  );
}

function updateSelectionSportChart(event) {
  $.get(
    format("/dashboard/api/get-indonesia-sport-medals?event=%s", event),
    function(data) {
      var selectionSportChartOptions = {
        series: data.series,
        xaxis: {
          categories: data.sports
        }
      };
      selectionSportChart.updateOptions(selectionSportChartOptions);
    }
  );
}
