// SVG drawing area

var margin = {top: 40, right: 60, bottom: 60, left: 80};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
var x = d3.scale.ordinal()
	.rangeBands([width,0],1);

var y = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var xAxisGroup = svg.append("g")
	.attr("class", "x‐axis axis")
	.attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
	.attr("class", "y‐axis axis");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialize data
loadData();

// FIFA world cup
var data;

// Load CSV file
function loadData() {
	d3.csv("data/WHY.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = formatDate.parse(d.YEAR);
			d.yr = formatDate(d.YEAR);
			// Convert numeric values to 'numbers'
			d.AREA = +d.AREA;
			d.BUDGET = +d.BUDGET;
			d.project = +d.project;
		});

		// Store csv data in global variable
		data = csv;
		console.log(data);
		// Draw the visualization for the first time
		updateVisualization();


	});
}
var sline = svg.append("path")
		.attr("class", "line");

var option="AREA";

// Render visualization
function updateVisualization() {
	option=d3.select("#chart-option").property("value");

//	filterData=data.filter(function(d){return d.yr <= max && d.yr >= min;});
	filterData=data.sort(function(a,b){return b.yr-a.yr});

	x.domain(filterData.map(function(d) { return d.yr; }));
	y.domain([0, d3.max(filterData, function (d) {return d[option];})]);

	svg.append("text")
		.attr("class","x")
		.attr("text-anchor", "end")
		.attr("transform", "translate("+ 25 +","+0+")rotate(-90)")

	svg.select("text.x")
		.text(option);

// Update (set the dynamic properties of the elements)
	svg.select(".x‐axis")
		.transition()
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.select(".y‐axis")
		.transition()
		.call(yAxis);

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong></strong>"
				+ "<div style='color:white'>"
				+ d.PROJECT
				+ "<br>"
				+ "Year: "
				+ d.yr
				+ "</div>";
		})

	svg.call(tip);

//join
	var circle = svg.selectAll("circle")
		.data(filterData);

//enter
	circle.enter().append("circle");

//update
	circle.transition()
		.attr("cx",function(d){return x(d.yr);})
		.attr("cy",function(d){return y(d[option]);})
		.attr("r",13)
		.attr("fill-opacity",0.8)
		.style("fill",function(d){
			if(d.BUDGET < 100000000){
				return "#3b3a30"
			}
			else { return "red"}
		})
		.text("+ d[PROJECT] +");

	circle.on("click",function(d){
		return showEdition(d);
	});

	circle.on("click",function(d){return showEdition(d);})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

// Exit
	circle.exit().remove();

}

// Show details for a specific FIFA World Cup
function showEdition(d){
	var f=d3.format(",");
	document.getElementById("image").src = "data/img/"+d.PROJECT+".jpg";

	console.log(d.PROJECT);
	d3.select("#PROJECT").text(d.PROJECT);
	d3.select("#AREA").text("Area: " + f(d.AREA) + " SF");
	d3.select("#BUDGET").text("Budget: "+f(d.BUDGET) +" USD");
	d3.select("#YEAR").text("Year: "+d.yr +" ");
	d3.select("#LOCATION").text("Location: "+d.LOCATION +" ");

}
