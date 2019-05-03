let selectionSportChart;

function loadIndonesiaSportSummaryChart() {
	$.get(
		format("/dashboard/api/get-indonesia-sport-summary/"),
		function(data) {
			var indonesiaSportSummaryChartOptions = {
				chart: {
					type: "donut",
					events: {
						dataPointSelection: function(event, chartContext, config) {
							console.log(data.labels[config.dataPointIndex])
							updateSelectionSportChart(data.labels[config.dataPointIndex]);
						}
					},
				},
				legend: {
					show: false
				},
				series: data.series,
				labels: data.labels,
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
				responsive: [{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: "bottom"
						}
					}
				}]
			};
		
			indonesiaSportSummaryChart = new ApexCharts(
				document.querySelector("#indonesia-sport-chart"),
				indonesiaSportSummaryChartOptions
			);
		
			indonesiaSportSummaryChart.render();
		}
	);
}
function loadSelectionSportChart(event) {

	$.get(
		format("/dashboard/api/get-indonesia-sport-medals?event=%s", event),
		function(data) {

			var selectionChartOptions = {
				chart: {
						height: 550,
						type: 'bar',
						stacked: true,
				},
				plotOptions: {
						bar: {
								horizontal: true,
						},
						
				},
				stroke: {
						width: 1,
						colors: ['#fff']
				},
				series: data.series,
				title: {
						text: 'Perolehan Medali Indonesia pada Asian Games 2018'
				},
				colors: ["#e1ca60", "#d3d3d1", "#cc8b4b"],
				xaxis: {
						categories: data.sports,
				},
				tooltip: {
				},
				fill: {
						opacity: 1
						
				},
				legend: {
						position: 'top',
						horizontalAlign: 'left',
						offsetX: 40
				}
		}

		selectionSportChart = new ApexCharts(
			document.querySelector("#selection-sport-chart"),
			selectionChartOptions
		);
		
		selectionSportChart.render();
	});
}

function updateSelectionSportChart(event) {
  $.get(
    format("/dashboard/api/get-indonesia-sport-medals?event=%s", event),
    function(data) {
      var selectionSportChartOptions = {
				series: data.series,
				xaxis: {
					categories: data.sports,
				}
      };
      selectionSportChart.updateOptions(selectionSportChartOptions);
    }
  );
}

window.onload = function() {
	loadIndonesiaSportSummaryChart()
	loadSelectionSportChart("Pilihan Indonesia")
}