function createAuditRatioGraph(user) {
    console.log('Creating audit ratio graph');

    const auditContainer = d3.select("#project-success-graph");
    auditContainer.selectAll("*").remove();

    auditContainer.append("h3")
    .style("text-align", "center")
    .text("Audit Ratio Chart");

    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = auditContainer.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
        { name: "Done", value: user.totalUp },
        { name: "Received", value: user.totalDown }
    ];

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.name))
        .padding(0.2);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
        .domain(["Done", "Received"])
        .range(["#FFA500", "#4682B4"]);

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.name));

    const doneMB = (user.totalUp / 1000000).toFixed(2);
    const receivedMB = (user.totalDown / 1000000).toFixed(2);


    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => {
            const valueInMB = d.value / 1000000;
            if (valueInMB < 1) {
                return `${valueInMB.toFixed(3)} MB`;
            } else {
                return `${valueInMB.toFixed(2)} MB`;
            }
        });
      
        auditContainer.append("div")
        .style("text-align", "center")
        .style("margin-top", "10px")
        .style("font-size", "16px")
        .text(`Audit Ratio: ${user.auditRatio.toFixed(1)}`);
    
    console.log('Audit ratio graph created');
}

function createSkillsPieChart(skills) {
    d3.select("#skills-chart").selectAll("*").remove();

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2 * 0.7;

    d3.select("#skills-chart")
    .append("h3")
    .style("text-align", "center")
    .text("Skill Distribution Chart");
  
    const color = d3.scaleOrdinal()
      .domain(skills.map(d => d.type.replace('skill_', '')))
      .range(['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']);
  
    const pie = d3.pie()
      .value(d => d.amount)
      .sort(null);
  
    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);
  
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
  
    const svg = d3.select("#skills-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
  
    const arcs = svg.selectAll("arc")
      .data(pie(skills))
      .enter()
      .append("g")
      .attr("class", "arc");
  
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.type.replace('skill_', '')))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 0.8);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.data.amount.toFixed(2)}%`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this).style("opacity", 1);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  
    const labelArc = d3.arc()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);
  
    arcs.append("text")
      .attr("transform", d => {
        const pos = labelArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.1 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("dy", ".35em")
      .style("text-anchor", d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .text(d => d.data.type.replace('skill_', ''))
      .style("font-size", "14px")
      .style("fill", "#333");
  
    arcs.append("polyline")
      .attr("points", d => {
        const pos = labelArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const x = radius * 1.25 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), [x, pos[1]]];
      })
      .style("fill", "none")
      .style("stroke", "#999")
      .style("stroke-width", "1px");
  
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }
  
