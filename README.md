# COVID-19 in Spain: Comparing affected cases between two different dates

 - Circles are placed in every region with   
people affected by COVID-19. 
 - Scale pin radius is based on affected number.


This code is based on:

- Lemoncode / d3js-typescript-examples  
[https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale](https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale)


# Steps

## Installation and Running

- Execute _npm install_.
```bash
npm install
```
- Execute _npm start_.
```bash
npm start
```
## Coding

- Adding the stats that we want to display -affected persons per community

_./stats.ts_

```typescript  
export  const  initial_stats : ResultEntry[] =[
{
	name:  "Madrid",
	value:  587
},
{
	name:  "La Rioja",
	value:  102
},
{
	name:  "Andalucía",
	value:  54
},
{
	name:  "Cataluña",
	value:  101
},
{
	name:  "Valencia",
	value:  50
},
{
	name:  "Murcia",
	value:  5
},
{
	name:  "Extremadura",
	value:  7
},
{
	name:  "Castilla La Mancha",
	value:  26
},
{
	name:  "País Vasco",
	value:  148
},
{
	name:  "Cantabria",
	value:  12
},
{
	name:  "Asturias",
	value:  10
},
{
	name:  "Galicia",
	value:  18
},

{
	name: "Aragón",
	value: 32
},
{
	name: "Castilla y León",
	value: 40
},
{
	name: "Islas Canarias",
	value: 24
},
{
	name: "Islas Baleares",
	value: 11
},
{
	name: "Navarra",
	value: 13
}
];

export  const  final_stats : ResultEntry[] =[
{
	name: "Madrid",
	value: 12352
},
{
	name: "La Rioja",
	value: 802
},
{
	name: "Andalucía",
	value: 2471
},

{
	name: "Cataluña",
	value: 7864
},
{
	name: "Valencia",
	value: 2167
},
{
	name: "Murcia",
	value: 385
},
{
	name: "Extremadura",
	value: 636
},
{
	name: "Castilla La Mancha",
	value: 2465
},
{
	name: "País Vasco",
	value: 2728
},
{
	name: "Cantabria",
	value: 425
},
{
	name: "Asturias",
	value: 662
},

{
	name: "Galicia",
	value: 1415
},
{
	name: "Aragón",
	value: 758
},
{
	name: "Castilla y León",
	value: 2460
},
{
	name: "Islas Canarias",
	value: 557
},
{
	name: "Islas Baleares",
	value: 478
},
{
	name: "Navarra",
	value: 1014
}
];
```

- Importing it into our index.ts

_./src/index.ts_
```typescript
import  *  as  d3  from  "d3";
import  *  as  topojson  from  "topojson-client";
const  spainjson = require("./spain.json");
const  d3Composite = require("d3-composite-projections");
import { latLongCommunities } from  "./communities";
import { initial_stats, final_stats, ResultEntry } from  "./stats";
```
- Adding bottons to _index.html_

```html
<body>
	<div>
		<button  id="initial">Base cases</button>
		<button  id="final">Current cases</button>
	</div>
	<script  src="./index.ts"></script>
</body>
```
- Including Event Listener to the bottons to modify the map depending on what date is selected:

_./src/index.ts_
```typescript
document
	.getElementById("initial")
	.addEventListener("click", function  handleInitialResults(){
		modifyMap(initial_stats)
	});
document
	.getElementById("final")
	.addEventListener("click", function  handleCurrentResults(){
		modifyMap(final_stats)
	});
```
- Every time one of the bottons is clicked, different attributes of the map must change:

_./src/index.ts_
```typescript
const  modifyMap = (data: ResultEntry[]) => {
	[...]
};
```
- Maximum number of affected of all communities
./src/index.ts_
```typescript
const  maxAffected = data.reduce(
	(max, item) => (item.value > max ? item.value : max), 0
);
```
- Scaling radius size depending on maxAffected

```typescript
const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height
```
- Using a  helper function to relate community name with affected cases.

_./src/index.ts_

```typescript
const  calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
	const  entry = data.find(item  =>  item.name === comunidad);
	return  entry ? affectedRadiusScale(entry.value) : 0
};
```

- Rendering the circles:
  -  To create a circle for first time: _.append()_
  -  To update the circle: _.merge()_
  -  Including _.transition_ and _duration_ to make the circle radius change slow.

```typescript
const  circles = svg.selectAll("circle")
circles
	.data(latLongCommunities)
	.enter()
	.append("circle")
	.attr("class", "affected-marker")
	.attr("r", function(d) {
		return  calculateRadiusBasedOnAffectedCases(d.name)
	})
	.attr("cx", d  =>  aProjection([d.long, d.lat])[0])
	.attr("cy", d  =>  aProjection([d.long, d.lat])[1])
	.merge(circles  as  any)
	.transition()
	.duration(400)
	.attr("r", function(d) {
		return  calculateRadiusBasedOnAffectedCases(d.name)
	});
```
