var bardata = [];
var fastestTime = 2210;

d3.json('cyclist-data.json',function(json){
    console.log(json);

var margin = {
    top: 5,
    right: 10,
    bottom: 40,
    left: 50
  },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var tooltip = d3.select('body').append('div')
    .style('position','absolute')
    .style('padding','0 10px')
    .style('background','white')
    .style('opacity',0)

var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([1,36])

var xScale = d3.scaleLinear()
    .domain([60 * 3.5, 0])
    .range([0, width]);

function makeTooltip(d) {
  var ttip = '<span>' + d.Name +': ' + d.Nationality + '<br>'
  ttip += 'Year: ' + d.Year +', Time: ' + d.Time +'<p>' + d.Doping +'</span>'
  return ttip
}

var formatTime = d3.timeFormat('%H:%M');
function formatMinutes(d) {
  var t = new Date(2017, 0, 1, 0, d)
  t.setSeconds(t.getSeconds() + d);
  return formatTime(t);
};

var chart = d3.select('#chart')
    .append('svg')
    .style('background','#E7E0CB')
    .attr('width',width + margin.left + margin.right)
    .attr('height',height + margin.top + margin.bottom)
    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
    .append('g')

chart.selectAll('circle')
    .data(json)
    .enter().append('circle')
    .style('fill', function (d){
      if (d.Doping ==""){ return '#2582EA'; }
      else { return '#E15858'; }
    })
    .attr('class', 'dot')
    .attr('r', 5)
    .attr('cx', function(d) {
      return xScale(d.Seconds - fastestTime);
    })
    .attr('cy', function(d) {
      return yScale(d.Place);
    })

chart.selectAll('text')
  .data(json)
    .enter()
    .append('text')
    .text(function(d) { return d.Name;})
    .attr('x', function(d) { return xScale(d.Seconds - fastestTime);})
    .attr('y', function(d) { return yScale(d.Place);})
    .attr('transform', 'translate(15,+4)')

chart.selectAll('circle')
    .on('mouseover',function(d){
    tooltip.transition()
    tooltip.html(makeTooltip(d))
    .style('opacity',.9)
    .style('left', 600 + 'px')
    .style('top', 200 + 'px')
    tempcolor = this.style.fill
    d3.select(this)
      .transition()
      .style('opacity',0.3)
    })
  .on('mouseout',function(d){
    tooltip.style('opacity',0)
    d3.select(this)
      .transition()
      .style('opacity',1)
      .style('fill',tempcolor)
  })

chart.append('g')
      .attr('transform','translate(' + 0 + ',' + (height + margin.top) + ')')
      .call(d3.axisBottom(xScale).tickFormat(formatMinutes).ticks(10));

chart.append('text')
      .attr('transform', 'translate(' + (width/2) + ' ,' + (height + margin.top + 35) + ')')
      .style('text-anchor', 'middle')
      .text('Minutes Behind Fastest Time');

chart.append('g')
      .attr('transform', 'translate(' + 40 + ',' + margin.top + ')')
      .call(d3.axisLeft(yScale).ticks(10))

chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate('+ 10 +','+(height/2+20)+')rotate(-90)')
      .text('Ranking');

chart.append('circle')
      .attr('r', 5)
      .attr('cx', function(d) {return xScale(50);})
      .attr('cy', function(d) {return yScale(35);})
      .style('fill', '#2582EA')

chart.append('text')
    .attr('x', function(d) {return xScale(47);})
    .attr('y', function(d) {return yScale(35);})
          .text(function(d){
            return 'Not Accused of Doping';
          })
chart.append('circle')
    .attr('r', 5)
    .attr('cx', function(d) {return xScale(50);})
    .attr('cy', function(d) {return yScale(33);})
    .style('fill', '#E15858')

chart.append('text')
    .attr('x', function(d) {return xScale(47);})
    .attr('y', function(d) {return yScale(33);})
          .text(function(d){
            return 'Accused of Doping';
          })
});
