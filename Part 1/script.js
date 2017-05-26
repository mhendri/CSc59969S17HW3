var bardata = [];
var dateData = [];
var tempcolor;
var formatCurrency = d3.format("$,.2f");
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


d3.json('GDP-data.json',function(json){
      for(var i=0; i<json.data.length;i++) {
        bardata.push(json.data[i][1])
        dateData.push(json.data[i][0])
    }
    console.log(bardata);
    console.log(dateData);

    var margin ={top:30, right:50, bottom:40, left:50}

    var height = 500 - margin.top - margin.bottom,
        width = 1200 - margin.right - margin.left,
        barWidth = Math.ceil(width / bardata.length),
        minDate = new Date(dateData[0]),
        maxDate = new Date(dateData[274]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bardata)])
        .range([0, height])

    var xScale = d3.scaleBand()
       .domain(d3.range(bardata.length))
       .rangeRound([0, width]);

    var xScale2 = d3.scaleTime()
        .domain([minDate, maxDate])
        .rangeRound([0, width]);

    var tooltip = d3.select('body').append('div')
            .style('position','absolute')
            .style('padding','0 10px')
            .style('background','white')
            .style('opacity',0)

    myChart = d3.select('#chart').append('svg')
      .style('background','#E7E0CB')
      .attr('width',width + margin.left + margin.right)
      .attr('height',height + margin.top + margin.bottom)
      .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
      .selectAll('rect').data(bardata)
      .enter().append('rect')
        .style('fill', '#2582EA')
        .attr('width', barWidth)
        .attr('x',function(d,i){
          return xScale(i);
        })
        .attr('height', 0)
        .attr('y', height)

        .on('mouseover',function(d,i){
          tooltip.transition()
            .style('opacity',.9)
            var currentDateTime = new Date(dateData[i]);
            var year = currentDateTime.getFullYear();
            var month = currentDateTime.getMonth();
            tooltip.html("<span class='amount'>" + formatCurrency(d) + "&nbsp;Billion </span><br><span class='year'>" +  year + ' - ' + months[month] + "</span>")
              .style('left', (d3.event.pageX +30) + 'px')
              .style('top', (d3.event.pageY+30) + 'px')
              tempcolor = this.style.fill
              d3.select(this)
                .transition()
                .style('opacity',0.5)
                .style('fill','yellow')
            })

        .on('mouseout',function(d){
          d3.select(this)
            .transition()
            .style('opacity',1)
            .style('fill',tempcolor)
            tooltip.style('opacity',0)
        })

        .transition()
            .attr('height', function(d) {
                return yScale(d);
            })
            .attr('y', function(d) {
                return height - yScale(d);
            })
            .duration(1000)

    var vGuideScale = d3.scaleLinear()
        .domain([0,d3.max(bardata)])
        .range([height,0])

    var vGuide = d3.select('svg').append('g')
      vGuide.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      vGuide.call(d3.axisLeft(vGuideScale).ticks(10))

    var hGuide = d3.select('svg').append('g')
      hGuide.attr('transform','translate(' + margin.left + ',' + (height + margin.top) + ')')
      hGuide.call(d3.axisBottom(xScale2).tickFormat(d3.timeFormat("%Y")));

});
