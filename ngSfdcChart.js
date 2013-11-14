// Depends
//  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js">
// <script type="text/javascript" src="https://www.google.com/jsapi"></script>
// <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js"></script>
// <script src="//cdnjs.cloudflare.com/ajax/libs/graphael/0.5.1/g.raphael-min.js"></script>
// <script src="//cdnjs.cloudflare.com/ajax/libs/graphael/0.5.1/g.dot-min.js"></script>
google.load("visualization", "1", {packages:["corechart"]});
angular.module('sfdcCharts', []).config(function($provide, $compileProvider, $filterProvider) {
    $compileProvider.directive('sfdcChart', function() {
        return {
            restrict: 'E',
            scope: {
                data: '=data',
                type: '=type'
            },
            template: '<div style="height: 400px; width: 400px;"></div>',
            link: function(scope, elem, attrs) {
                if(scope.type === 'pie') {
                  var chartPoints = [];
                  chartPoints.push(['Grouping', 'Metric']);
                  angular.forEach(scope.data.groupingsDown.groupings, function (value, index) {
                      chartPoints.push([value.label, scope.data.factMap[value.key + "!T"].aggregates[0].value]);
                  });
                  var myData = google.visualization.arrayToDataTable(chartPoints);
                  new google.visualization.PieChart(elem.children()[0]).draw(myData, {});
                } else if(scope.type === 'dot') {
                    var valuesx = [];
                    var labelsx = new Array();
                    var valuesy = [];
                    var labelsy = new Array();
                    var size = [];
                    angular.forEach(scope.data.groupingsDown.groupings, function(de, di) {
                        angular.forEach(de.groupings, function(ae, ai) {
                            valuesx.push(di);
                            labelsx[di] = de.label;
                            valuesy.push(ai);
                            labelsy[ai] = ae.label;
                            size.push((scope.data.factMap[ae.key+"!T"].aggregates[0].value));
                        });
                    });
                    var r = Raphael(elem.children()[0]);
                    r.dotchart(10, 10, 600, 480, valuesx, valuesy, size, 
                        {
                            symbol: "o", 
                            max: 20, 
                            heat: true, 
                            axis: "0 0 1 1", 
                            axisxstep: valuesx.length - 1, 
                            axisystep: valuesy.length - 1, 
                            axisxlabels: labelsx, 
                            axisxtype: " ", 
                            axisytype: " ", 
                            axisylabels: labelsy
                        }
                    ).hover(function () {
                            this.marker = this.marker || r.tag(this.x, this.y, this.value, 0, this.r + 2).insertBefore(this);
                            this.marker.show();
                        }, function () {
                            this.marker && this.marker.hide();
                        }
                    );
                }
            }
        };
    });
});
