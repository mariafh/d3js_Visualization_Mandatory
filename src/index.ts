import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { initial_stats, final_stats, ResultEntry } from "./stats";


const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

// Scaling an center
const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any);


const modifyMap = (data: ResultEntry[]) => {
  const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max), 0
    ); 

  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .clamp(true)
    .range([5, 50]); // 50 pixel max radius, we could calculate it relative to width and height

  const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
    const entry = data.find(item => item.name === comunidad);
    return entry ? affectedRadiusScale(entry.value) : 0
  };  
  
  const circles = svg.selectAll("circle")
  circles
    .data(latLongCommunities)
    .enter()
    .append("circle")
    .attr("class", "affected-marker")
    .attr("r", function(d) {
      return calculateRadiusBasedOnAffectedCases(d.name)
    })
    .attr("cx", d => aProjection([d.long, d.lat])[0])
    .attr("cy", d => aProjection([d.long, d.lat])[1])
    .merge(circles as any)  
    .transition()
    .duration(400)
    .attr("r", function(d) {
      return calculateRadiusBasedOnAffectedCases(d.name)
    });
};

document
  .getElementById("initial")
  .addEventListener("click", function handleInitialResults(){
    modifyMap(initial_stats)
  });

document
  .getElementById("final")
  .addEventListener("click", function handleCurrentResults(){
    modifyMap(final_stats)
  });

  modifyMap(initial_stats)