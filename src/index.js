import * as d3 from 'd3'

function SocialGraphVisualizer (options = {}) {
  if (!options.selector) {
    throw new Error('You did not supply any element to draw on.')
  }

  this.parentEl = d3.select(options.selector)
  if (!this.parentEl) {
    throw new Error('The element you supplied does not exist.')
  }

  this.elWidth = this.parentEl._groups[0][0].clientWidth
  this.elHeight = this.parentEl._groups[0][0].clientHeight

  this.parentEl
    .append('svg')
    // responsive SVG needs these 2 attributes and no width and height attr
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('viewBox', `0 0 ${this.elWidth} ${this.elHeight}`)

  this.svg = d3.select('svg')

  if (!options.graph) {
    throw new Error('You did not supply any graph object to render.')
  }

  this.graph = options.graph
  this.simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(this.elWidth / 2, this.elHeight / 2))
}

SocialGraphVisualizer.prototype.render = function (options = {
  nodeDiameter: 20
}) {
  const nodeDiameter = options.nodeDiameter
  console.log(nodeDiameter)
  var link = this.svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(this.graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  var node = this.svg
    .selectAll('.node')
    .data(this.graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted.bind(this))
      .on('drag', dragged.bind(this))
      .on('end', dragended.bind(this))
    )
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

  node.append('image')
    .attr('xlink:href', d => d.avatar)
    .attr('x', -nodeDiameter / 2)
    .attr('y', -nodeDiameter / 2)
    .attr('width', nodeDiameter)
    .attr('height', nodeDiameter)
    .style('display', 'block')
    .style('border-radius', '50%')

  this.simulation.nodes(this.graph.nodes)
    .on('tick', ticked)

  this.simulation.force('link')
    .links(this.graph.links)

  function ticked () {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
  }

  function dragstarted (d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.3).restart()
    }
    d.fx = d.x
    d.fy = d.y
  }

  function dragged (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended (d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }

  function mouseover () {
    d3.select(this)
      .raise()
      .append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.id)
  }

  function mouseout () {
    d3.select(this)
      .select('text')
      .remove()
  }
}

export default SocialGraphVisualizer
