$('#container').bind('mousemove touchmove touchstart', function(e) {
  var chart,
    point,
    i,
    event;

  for (i = 0; i < Highcharts.charts.length; i = i + 1) {
    chart = Highcharts.charts[i];
    // Find coordinates within the chart
    event = chart.pointer.normalize(e.originalEvent);
    // Get the hovered point
    point = chart.series[0].searchPoint(event, true);

    if (point) {
      point.highlight(e);
    }
  }
});

// change colors to dark theme

Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
             '#FF9655', '#FFF263', '#6AF9C4']
});

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function() {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function(event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function(chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(
            e.min,
            e.max,
            undefined,
            false, {
              trigger: 'syncExtremes'
            }
          );
        }
      }
    });
  }
}

/**
 * Set default extremes
 */
function defaultExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'defaultExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function(chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
		chart.xAxis[0].setExtremes(chart.xAxis[0].dataMax-2000);
		chart.showResetZoom();
        }
      }
    });
  }

}

// Get the data. The contents of the data file can be viewed at
$.getJSON(
  'https://myblocks.net/amoveo/datajsonhc.php',
  function(activity) {
    $.each(activity.datasets, function(i, dataset) {

      // Add X values
      dataset.data = Highcharts.map(dataset.data, function(val, j) {
        return [activity.xData[j], val];
      });

      $('<div class="chart">')
        .appendTo('#container')
        .highcharts({
          chart: {
            marginLeft: 40, // Keep all charts left aligned
			marginRight: 40,
            spacingTop: 20,
            spacingBottom: 20,
			zoomType: 'x',
		    resetZoomButton: {
				position: {
					align: 'left',
					verticalAlign: 'top',
					x: 40,
					y: 52
				},
				relativeTo: 'chart'
		    },
			events: {
				load: defaultExtremes
			}
          },
          title: {
            text: dataset.name,
            align: 'left',
            margin: 0,
            x: 30
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          xAxis: {
            crosshair: true,
            events: {
              setExtremes: syncExtremes
            },
            labels: {
              format: '{value}'
            }
          },
          yAxis: {
            title: {
              text: null
            }
          },
          tooltip: {
            positioner: function() {
              return {
                // right aligned
                x: this.chart.chartWidth - this.label.width - 32,
                y: 10 // align to title
              };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: 'Block {point.x} / {point.y}',
            headerFormat: '',
            shadow: false,
            style: {
              fontSize: '18px'
            },

            valueDecimals: dataset.valueDecimals
          },
          series: [{
            data: dataset.data,
            name: dataset.name,
            type: dataset.type,
			id: dataset.name,
            color: Highcharts.getOptions().colors[i],
            fillOpacity: 0.3,
            tooltip: {
              valueSuffix: ' ' + dataset.unit
            }
		   }, {
			type: 'sma',
			linkedTo: 'nethash',
			color: '#aaa',
			marker: {
			   enabled: false
			},
			params: {
				period: 20
			}
		   }, {
			type: 'sma',
			linkedTo: 'blocktime',
			color: '#aaa',
			marker: {
			   enabled: false
			},
			params: {
				period: 20
			}
          }]
        });
    });

  }
);