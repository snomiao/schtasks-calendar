// import * as d3 from "d3";

export async function drawChart(node: any, height = 599, width = 599) {
  if (!globalThis.window) return;
  globalThis.this = globalThis;
  const d3 = await import("d3");

  d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black")
    .append("text")
    .attr("fill", "green")
    .attr("x", 50)
    .attr("y", 50)
    .text("Hello D3");
}
