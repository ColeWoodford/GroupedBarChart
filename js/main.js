var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var x = d3.scaleBand().rangeRound([0, width])
  .padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [{
  "Family": "Mars",
  "count": 10,
  "name": "chemical 1"
},{
    "Family": "Mars",
    "count": 15,
    "name": "chemical 14"
  },{
    "Family": "Mars",
    "count": 10,
    "name": "chemical 7"
  },{
    "Family": "Mars",
    "count": 10,
    "name": "chemical 8"
  }, {
    "Family": "Mars",
    "count": 15,
    "name": "chemical 3"
  },{
    "Family": "Mars",
    "count": 15,
    "name": "chemical 13"
  },{
  "Family": "Jupiter",
  "count": 7,
  "name": "chemical 2"
},  {
  "Family": "Jupiter", 
  "count": 20,
  "name": "chemical 4"
}, {
    "Family": "Jupiter", 
    "count": 18,
    "name": "chemical 5"
},
{
    "Family": "Jupiter", 
    "count": 18,
    "name": "chemical 6"
},{
    "Family": "Earth", 
    "count": 18,
    "name": "chemical 9"
},];

var ymaxdomain = d3.max(data, function(d) {
  return d.count;
});
x.domain(data.map(function(d) {
  return d.Family
}));
y.domain([0, ymaxdomain]);

//we need different ranges for each set of bars inside the family g
var x1 = new Map();
data.forEach(entry => {
    x1.set(entry.Family, d3.scaleBand()
                        .rangeRound([0, x.bandwidth()])
                        .padding(0.1)
                        .domain(data.map(function(d) {
                            if (d.Family === entry.Family) {
                                return d.name;
                            }
                        })));
});

  var allBarScale = d3.scaleBand()
  .rangeRound([0, x.bandwidth()])
  .padding(0)
  .domain(data.map(function(d) {
    return d.name;
  }));

color.domain(data.map(function(d) {
  return d.name;
}));

var groups = g.selectAll(null)
  .data(data)
  .enter()
  .append("g")
  .attr("transform", function(d) {
    return "translate(" + x(d.Family) + ",0)";
  })

var bars = groups.selectAll(null)
  .data(function(d) {
    return [d]
  })
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return x1.get(d.Family)(d.name)
  })
  .attr("y", function(d) {
    return y(d.count);
  })
  .attr("width", allBarScale.bandwidth())
  .attr("height", function(d) {
    return height - y(d.count);
  })
  .attr("fill", function(d) {
    return color(d.name)
  })

g.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

g.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(null, "s"))
  .append("text")
  .attr("x", 2)
  .attr("y", y(y.ticks().pop()) + 0.5)
  .attr("dy", "0.32em")
  .attr("fill", "#000")
  .attr("font-weight", "bold")
  .attr("text-anchor", "start")
  .text("count");
    