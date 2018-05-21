$('#container').bind('mousemove touchmove touchstart',function(e){var chart,point,i,event;for(i=0;i<Highcharts.charts.length;i=i+1){chart=Highcharts.charts[i];event=chart.pointer.normalize(e.originalEvent);point=chart.series[0].searchPoint(event,!0);if(point){point.highlight(e)}}});Highcharts.setOptions({colors:['#058DC7','#50B432','#ED561B','#DDDF00','#24CBE5','#64E572','#FF9655','#FFF263','#6AF9C4']});Highcharts.Pointer.prototype.reset=function(){return undefined};Highcharts.Point.prototype.highlight=function(event){event=this.series.chart.pointer.normalize(event);this.onMouseOver();this.series.chart.tooltip.refresh(this);this.series.chart.xAxis[0].drawCrosshair(event,this)};function syncExtremes(e){var thisChart=this.chart;if(e.trigger!=='syncExtremes'){Highcharts.each(Highcharts.charts,function(chart){if(chart!==thisChart){if(chart.xAxis[0].setExtremes){chart.xAxis[0].setExtremes(e.min,e.max,undefined,!1,{trigger:'syncExtremes'})}}})}}
function defaultExtremes(e){var thisChart=this.chart;if(e.trigger!=='defaultExtremes'){Highcharts.each(Highcharts.charts,function(chart){if(chart!==thisChart){if(chart.xAxis[0].setExtremes){chart.xAxis[0].setExtremes(chart.xAxis[0].dataMax-2000);chart.showResetZoom()}}})}}
$.getJSON('https://myblocks.net/amoveo/datajsonhc.php',function(activity){$.each(activity.datasets,function(i,dataset){dataset.data=Highcharts.map(dataset.data,function(val,j){return[activity.xData[j],val]});$('<div class="chart">').appendTo('#container').highcharts({chart:{marginLeft:40,marginRight:40,spacingTop:20,spacingBottom:20,zoomType:'x',resetZoomButton:{position:{align:'left',verticalAlign:'top',x:40,y:52},relativeTo:'chart'},events:{load:defaultExtremes}},title:{text:dataset.name,align:'left',margin:0,x:30},credits:{enabled:!1},legend:{enabled:!1},xAxis:{crosshair:!0,events:{setExtremes:syncExtremes},labels:{format:'{value}'}},yAxis:{title:{text:null}},tooltip:{positioner:function(){return{x:this.chart.chartWidth-this.label.width-32,y:10}},borderWidth:0,backgroundColor:'none',pointFormat:'Block {point.x} / {point.y}',headerFormat:'',shadow:!1,style:{fontSize:'18px'},valueDecimals:dataset.valueDecimals},series:[{data:dataset.data,name:dataset.name,type:dataset.type,id:dataset.name,color:Highcharts.getOptions().colors[i],fillOpacity:0.3,tooltip:{valueSuffix:' '+dataset.unit}},{type:'sma',linkedTo:'nethash',color:'#aaa',marker:{enabled:!1},params:{period:20}},{type:'sma',linkedTo:'blocktime',color:'#aaa',marker:{enabled:!1},params:{period:20}}]})})})