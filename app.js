function scatterplotChart() {
    var margin = { top: 20, right: 20, bottom: 100, left: 180 },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        gridlinePadding = 3,
        xValue = function(d) {
            return d[0];
        },
        yValue = function(d) {
            return d[1];
        },
        xScale = d3.scale.linear(),
        yScale = d3.scale.log().base(Math.E),
        sizeScale = d3.scale.linear(),
        xFormat = function(d) {
            return d;
        },
        yFormat = function(d) {
            return d;
        },
        xLabel = ' ',
        yLabel = ' ',
        chartTitle = '',
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
        yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(3).tickSize(6, 0),
        yGridlinesAxis = d3.svg.axis().scale(yScale).orient("left"),
        genreColorMap = { "Horror": '#83beeb', "Animation": '#83ebd3', "Musical": '#83eb85', "Sci-Fi/Fantasy": '#cceb83', "Fantasy": '#eb9683', "Drama": '#9383eb', "Comedy": '#d183eb', "Special Interest": '#eb83b5', "Action/Adventure": '#eae582' };

    function chart(selection) {
        selection.each(function(data) {
            var tooltip = d3.select(this).append('div').classed('tooltip', true)
                .style({ 'opacity': 0 });
            var chartData = data.map(function(d, i) {
                return [xValue.call(chartData, d, i), yValue.call(chartData, d, i), d.Genre];
            });


            xAxis.tickFormat(xFormat);
            yAxis.tickFormat(yFormat);

            xScale
                .domain([d3.min(chartData, function(d) {
                    return d[0]
                }), d3.max(chartData, function(d) {
                    return d[0]
                })])
                .range([0, width]).nice();


            yScale
                .domain([d3.min(chartData, function(d) {
                    return d[1]
                }), d3.max(chartData, function(d) {
                    return d[1]
                })])
                .range([height, 0]).nice();

            var svg = d3.select(this).selectAll("svg").data([chartData]);

            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            svg.attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom);

            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var yGridlineNodes = svg.append('g')
                .attr('transform', 'translate(' + (margin.left + width) + ',' + margin.top + ')')
                .call(yGridlinesAxis.tickSize(width + gridlinePadding, 0, 0).tickFormat(""));

            styleGridlineNodes(yGridlineNodes);
            //Remove bottom tick
            yGridlineNodes.select('.tick').filter(function(d, i) {
                return i === 0
            }).remove();

            g.select(".x.axis")
                .attr({
                    "transform": "translate(" + (xScale.range()[0] - 10) + "," + yScale.range()[0] + ")"
                })
                .call(xAxis)
                .selectAll('.x.axis text')
                .style({
                    'text-anchor': 'end'
                })
                .attr({
                    'dy': '-0.005em',
                    'dx': '-0.8em',
                    'transform': 'rotate(-65)'
                });

            var yText = d3.select(this)
                .select('svg')
                .append("text")
                .classed("label", true)
                .attr({
                    'transform': 'translate(' + margin.left / 2 + ',' + height / 2 + ') rotate(-90)',
                    'text-anchor': 'middle'
                })
                .text(yLabel);

            var xText = d3.select(this)
                .select('svg')
                .append("text")
                .classed("label", true)
                .attr({
                    'transform': 'translate(' + (width / 2 + margin.left) + ',' + (height + margin.bottom) + ')',
                    'text-anchor': 'middle'
                })
                .text(xLabel);




            svg.selectAll('.axis')
                .style({
                    'opacity': 0.8
                })


            g.select('.y.axis')
                .attr("transform", "translate(" + (xScale.range()[0] - 10) + ",0)")
                .call(yAxis);


            g.append('g')
                .classed('circles', true)
                .selectAll('circle')
                .data(chartData)
                .enter()
                .append("circle")
                .attr({
                    'cx': function(d, i) {
                        return xScale(d[0]);
                    },
                    'cy': function(d, i) {
                        return yScale(d[1]);
                    },
                    'r': 7,
                    'fill': function(d) {
                        return genreColorMap[d[2]];
                    },
                    'stroke': 'black',
                    'stroke-opacity': 0.5
                })
                .on("mouseover", function(d, i) {

                  d3.select(this).attr({'stroke-opacity': 1})

                    var tooltipObject =
                        `<h1>${data[i].Movie}</h1>
                        <p>${data[i].Genre}</p>
                        <h2>${data[i]["Release Date"]}</h2>
                        <h2>Profit: ${data[i]["Approx. Profit"]}</h2>
                        <h2>Budget: ${data[i]["Production Budget"]}</h2>
                        <h2>RoI: ${data[i]["RoI"]}</h2>
                        `
                    tooltip.style({
                        'opacity': 0.9,
                        'left': (d3.event.pageX) + 'px',
                        'top': (d3.event.pageY - 30) + 'px'
                    }).html(tooltipObject)
                })
                .on("mouseout", function() {
                  d3.select(this).attr({'stroke-opacity': 0.5})
                    tooltip.style({
                        'opacity': 0
                    })
                });


            svg.append("text")
                  .attr({
                    "x": (width * 0.75),
                    "y": (height * 0.13),
                    "text-anchor": "middle"
                  })
                  .style({
                    "font-size" : "2em",
                    "text-decoration": "underline",
                    "stroke": "#aaa"
                  })
                .text(chartTitle);

        });
    }

    function X(d) {
        return xScale(d[0]);
    }


    function Y(d) {
        return yScale(d[1]);
    }

    function styleGridlineNodes(axisNodes) {
        axisNodes.selectAll('.domain')
            .attr({
                fill: 'none',
                stroke: 'none'
            });
        axisNodes.selectAll('.tick line')
            .attr({
                fill: 'none',
                'stroke-width': 1,
                stroke: 'lightgray'
            });
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    chart.xFormat = function(_) {
        if (!arguments.length) return xFormat;
        xFormat = _;
        return chart;
    };

    chart.yFormat = function(_) {
        if (!arguments.length) return yFormat;
        yFormat = _;
        return chart;
    };

    chart.xLabel = function(_) {
        if (!arguments.length) return xLabel;
        xLabel = _;
        return chart;
    };

    chart.yLabel = function(_) {
        if (!arguments.length) return yLabel;
        yLabel = _;
        return chart;
    };

    chart.chartTitle = function(_) {
        if (!arguments.length) return chartTitle;
        chartTitle = _;
        return chart;
    }

    return chart;
}

window.onload = function() {
    d3.csv('movies.csv', function(data) {
        var roiChart = scatterplotChart()
            .x(function(d) {
                return +(d["Production Budget"].replace(/[\$\,]/g, "")) / 1000000;
            })
            .y(function(d) {
                return +(d["RoI"].replace(/\%/g, ""));
            })
            .xFormat(function(d) {
                return '$' + d
            })
            .yFormat(function(d, i) {
                return Math.round(d / 100) * 100 + '%';
            })
            .xLabel("Estimated Budget (in millions of dollars)")
            .yLabel("Return on Investment (Worldwide Gross / Budget)")
            .chartTitle("Why Are There So Many Horror Movies?");

        var grossChart = scatterplotChart()
          .x(function(d) {
                return +(d["Production Budget"].replace(/[\$\,]/g, "")) / 1000000;
            })
          .y(function(d) {
                return +(d["Approx. Profit"].replace(/[\$\,]/g, ""));
          })
          .xFormat(function(d) {
                return '$' + d
            })
          .yFormat(function(d) {
                return '$' + Math.ceil(d / 1000000);
            })
          .xLabel("Estimated Budget (in millions of dollars)")
          .yLabel("Approx. Profit (in millinos of dollars)")
          .chartTitle("")
        d3.select('#roi-chart').datum(data).call(roiChart);
        d3.select('#gross').datum(data).call(grossChart);
    })
}
