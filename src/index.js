import * as d3 from 'd3'

function SocialGraphVisualizer (options = {}) {
  if (!options.selector) {
    throw new Error('You did not supply any element to draw on.')
  }

  this.parentEl = d3.select(options.selector)
  if (!this.parentEl) {
    throw new Error('The element you supplied does not exist.')
  }
  this.parentEl
    .append('svg')
    // responsive SVG needs these 2 attributes and no width and height attr
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('viewBox', `0 0 ${this.parentEl._groups[0][0].clientWidth} ${this.parentEl._groups[0][0].clientHeight}`)

  this.svg = d3.select('svg')

  if (!options.graph) {
    throw new Error('You did not supply any graph object to render.')
  }

  this.graph = options.graph
}

SocialGraphVisualizer.prototype.render = function () {
  var color = d3.scaleOrdinal(d3.schemeCategory20)

  var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(this.svg._groups[0][0].clientWidth / 2, this.svg._groups[0][0].clientHeight / 2))

  var link = this.svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(this.graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  var node = this.svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(this.graph.nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', d => color(d.group))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )

  node.append('title')
    .text(d => d.id)

  simulation.nodes(this.graph.nodes)
    .on('tick', ticked)

  simulation.force('link')
    .links(this.graph.links)

  function ticked () {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node.attr('cx', d => d.x)
        .attr('cy', d => d.y)
  }

  function dragstarted (d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart()
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
      simulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }
}

export default SocialGraphVisualizer
