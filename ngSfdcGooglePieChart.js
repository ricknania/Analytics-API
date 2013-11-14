// Depends on Google Viz
// <script type="text/javascript" src="https://www.google.com/jsapi"></script>

var sfdcCharts = angular.module('sfdcCharts', []);
google.load("visualization", "1", {packages:["corechart"]});
sfdcCharts.directive('pieChart', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=data'
        },
        template: '<div style="height: 400px; width: 400px;"></div>',
        link: function(scope, elem, attrs) {
          var chartPoints = [];
          chartPoints.push(['Grouping', 'Metric']);
          angular.forEach(scope.data.groupingsDown.groupings, function (value, index) {
              chartPoints.push([value.label, scope.data.factMap[value.key + "!T"].aggregates[0].value]);
          });
          var myData = google.visualization.arrayToDataTable(chartPoints);
          new google.visualization.PieChart(elem.children()[0]).draw(myData, {});
        }
    };
});
