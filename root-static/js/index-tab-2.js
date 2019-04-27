// hosts-line-chart
var hostsLineChartOptions = {
    chart: {
        type: 'line',
        toolbar: {
            show: false,
        },
    },
    series: [{
        name: 'Indonesia',
        data: [15, 20, 30, 23],
    }, {
        name: 'Korea',
        data: [20, 40, 35, 30],
    }],
    xaxis: {
        categories: [2006, 2010, 2014, 2018],
        title: {
            text: 'Year',
        },
    },
    yaxis: {
        title: {
            text: 'Gold Medals',
        },
    },
};
var hostsLineChart = new ApexCharts(document.querySelector('#hosts-line-chart'), hostsLineChartOptions);
hostsLineChart.render();

// individual-country-bar-chart
var individualCountryBarChartOptions = {
    chart: {
        type: 'bar',
        toolbar: {
            show: false,
        },
    },
    series: [{
        name: 'Gold Medals',
        data: [14, 20, 30, 23],
    }],
    xaxis: {
        categories: [2006, 2010, 2014, 2018],
        title: {
            text: 'Year',
        },
    },
    yaxis: {
        title: {
            text: 'Gold Medals',
        },
    },
};

var individualCountryBarChart = new ApexCharts(document.querySelector('#individual-country-bar-chart'),
    individualCountryBarChartOptions);
individualCountryBarChart.render();

// Functions to call APIs using AJAX and update apex charts data
function updateIndividualCountryBarChart(country) {
    $.get(format('/dashboard/api/get-detail-country-gold-medals?country=%s', country), function(data) {
        var individualCountryBarChartNewOptions = {
            series: [{
                data: data.golds,
            }],
            xaxis: {
                categories: data.year,
            },
        };
        individualCountryBarChart.updateOptions(individualCountryBarChartNewOptions);
    });
};

// Functions to update displays
function selectCountry(country) {
    // TODO: Update country flag
    $('#country-name').html('KOR');
    updateIndividualCountryBarChart(country);
};
