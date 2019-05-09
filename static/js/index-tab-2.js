// GLOBAL VARS
HOST_COLOR = "#bb3431";
NON_HOST_COLOR = "#c9c9c9";
HOST_STROKE = 4;
NON_HOST_STROKE = 1;
var countries;
var selectedCountry;

// hosts-line-chart
var hostsLineChartOptions = {
  chart: {
    type: "line",
    toolbar: {
      show: false
    }
  },
  colors: [NON_HOST_COLOR],
  series: [],
  xaxis: {
    categories: [],
    title: {
      text: "Tahun Event"
    }
  },
  yaxis: {
    title: {
      text: "Medali Emas"
    }
  },
  legend: {
    show: false
  },
  stroke: {
    width: [1, 1, 1, 1, 4, 1, 1]
  }
};
var hostsLineChart = new ApexCharts(
  document.querySelector("#hosts-line-chart"),
  hostsLineChartOptions
);
hostsLineChart.render();

// individual-country-bar-chart
var individualCountryBarChartOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      distributed: true
    }
  },
  series: [
    {
      name: "Medali Emas",
      data: []
    }
  ],
  xaxis: {
    categories: [],
    title: {
      text: "Tahun Event"
    }
  },
  yaxis: {
    title: {
      text: "Medali Emas"
    }
  }
};

var individualCountryBarChart = new ApexCharts(
  document.querySelector("#individual-country-bar-chart"),
  individualCountryBarChartOptions
);
individualCountryBarChart.render();

// Functions to call APIs using AJAX and update apex charts data
function initHostsLineChart() {
  $.get("/dashboard/api/get-country-gold-medals", function(data) {
    countries = data.countries;
    var hostsLineChartNewOptions = {
      series: data.countries_medals,
      xaxis: {
        categories: data.years
      }
    };
    hostsLineChart.updateOptions(hostsLineChartNewOptions);
    insertSelectionData(data.hosts);
  });
}

function hightlightHostsLineChart(country) {
  var colors = [];
  var strokes = [];
  countries.forEach(function(value, key, set) {
    if (value === country) {
      colors.push(HOST_COLOR);
      strokes.push(HOST_STROKE);
    } else {
      colors.push(NON_HOST_COLOR);
      strokes.push(NON_HOST_STROKE);
    }
  });
  var hostsLineChartNewOptions = {
    colors: colors,
    stroke: {
      width: strokes
    }
  };
  hostsLineChart.updateOptions(hostsLineChartNewOptions);
}

function updateIndividualCountryBarChart(country) {
  $.get(
    format("/dashboard/api/get-detail-country-gold-medals?country=%s", country),
    function(data) {
      var colors = [];
      data.hosts.forEach(function(value, key, set) {
        if (value === true) colors.push(HOST_COLOR);
        else colors.push(NON_HOST_COLOR);
      });
      var individualCountryBarChartNewOptions = {
        series: [
          {
            data: data.golds
          }
        ],
        xaxis: {
          categories: data.year
        },
        colors: colors
      };
      individualCountryBarChart.updateOptions(
        individualCountryBarChartNewOptions
      );
    }
  );
}

// Functions to update displays
function insertSelectionData(countries) {
  var countriesSet = new Set(countries);
  var selectOptions = "";
  countriesSet.forEach(function(value, key, set) {
    selectOptions += format(
      '<option value="%s" %s>%s</option>',
      key,
      key === "Indonesia" ? "selected" : "",
      key
    );
  });
  $("#country-selector").html(selectOptions);
  $("#country-selector").selectpicker("refresh");
  selectCountry("Indonesia");
}

function selectCountry(country) {
  selectedCountry = country;
  imageFormat = 'svg';
  if (country === 'China') {
    $('#country-flag-image').removeClass('country-flag-image');
    imageFormat = 'png';
  } else {
    $('#country-flag-image').addClass('country-flag-image');
  }
  $("#country-flag-image").attr(
    "src",
    format("/static/assets/country-flags/%s.%s", country, imageFormat)
  );
  //$('#country-name').html(country.substring(0, 3));
  hightlightHostsLineChart(country);
  updateIndividualCountryBarChart(country);
}
