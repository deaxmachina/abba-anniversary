import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import albums from "./data/albums.json"
import albumsFor3D from '../Albums3DScene/albums'
import * as d3 from 'd3'
import _ from 'lodash'
import './SongsViz.scss'

console.log('albums', albums)

const SongsViz = ({ selectedAlbumId }) => {

  const tracksInAlbum = useMemo(() => {
    return albums.filter(d => d.id === selectedAlbumId)[0].tracks
  }, [selectedAlbumId])
  // Create data for node-link graph 
  const data = { 
    nodes: tracksInAlbum.map(track => ({...track, size: _.sample([8, 10, 16])})), 
    links: _.uniqBy(_.range(12).map(i => {
      const source = _.sample(tracksInAlbum).id
      const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
      return ({ source, target })
    }), d => `${d.source}-${d.target}`).map(link => ({...link, size: _.sample([0.3, 0.7, 1.6])}))
  }

  const wrapperRef = useRef()
  const wrapperWidth = wrapperRef?.current?.getBoundingClientRect().width
  const wrapperHeight = wrapperRef?.current?.getBoundingClientRect().height
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  // Set the width and height for the svg to 100% of the 
  // width and height of the wrapper as soon as the wrapperRef exists
  useLayoutEffect(() => {
    setWidth(Math.floor(wrapperWidth))
    setHeight(Math.floor(wrapperHeight))
  }, [wrapperRef, wrapperWidth, wrapperHeight])

  useEffect(() => {
    console.log('width', width)
    console.log('height', height)
  }, [width, height])


  // Define the d3 simulation for node-link graph
  // Note: I don't think this will be responsive with width and height
  // Maybe it needs to be wrapped in a memo
  const links = data.links.map(d => ({...d}))
  const nodes = data.nodes.map(d => ({...d}))
  const [nodesSimulation, setNodesSimulation] = useState(null)
  const [linksSimulation, setLinksSimulation] = useState(null)
  const simulation = useRef()
  useEffect(() => {
    simulation.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      //.force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width * 0.5, height * 0.4).strength(1))
      .force("x", d3.forceX((d, i) => i * 50).strength(0.5))
      .force("collide", d3.forceCollide().radius(50).strength(0.2))
      .on("tick", () => {
        //console.log('tick happened')
        setNodesSimulation(() => [...nodes])
        setLinksSimulation(() => [...links])
      })
      //.stop(); // Stop the simulation initially
  }, [width, height])

  const nodesRef = useRef() 

  const [selectedNode, setSelectedNode] = useState(null)
  const [clickedNode, setClickedNode] = useState(null)



  return (
    <>
      <div className="wrapper-viz" ref={wrapperRef} >
        <svg className='stars-viz-svg' onClick={(e) => {
          e.stopPropagation()
          setClickedNode(null)
        }} >

          {/* Filers */}
          <defs>
            <filter id='glow'>
              <feGaussianBlur stdDeviation='10' result='coloredBlur'></feGaussianBlur>
              <feMerge>
                <feMergeNode id='coloredBlur'></feMergeNode>
                <feMergeNode id='SourceGraphic'></feMergeNode>
              </feMerge>
            </filter>
          </defs>

          {
            (width > 0 && height > 0 && linksSimulation) && linksSimulation.map((link, i) => (
              <line
                className='link'
                key={`${link.source}-${link.target}-${i}`}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke='#fcedbb'
                strokeWidth={link.size}
                opacity={clickedNode === null ? 1 : 0}
              ></line>
            ))
          }
          <g className='nodes-g' ref={nodesRef} style={{ filter: "url(#glow)" }} >
            {
              (width > 0 && height > 0 && nodesSimulation) && nodesSimulation.map((node, i) => (
                <circle
                  key={`${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  fill='#ea9918'
                  opacity={node.id === clickedNode || clickedNode === null ? 1 : 0.1}
                  style={{ pointerEvents: 'none' }}
                  r={node.id !== clickedNode ? node.size : 30}
                  transform={ clickedNode === null ? 'none' : node.id === clickedNode
                    ? `translate(${width/2 - node.x - 15}, ${height/2 - node.y - 15})` 
                    : `none`
                  }
                ></circle>
              ))
            }
          </g>
          <g className='nodes-g' >
            {
              (width > 0 && height > 0 && nodesSimulation) && nodesSimulation.map((node, i) => (
                <g className='circle-g' key={`${node.id}`} >
                  <circle    
                    fill={node.id === selectedNode ? '#ea9918' : '#ea9918'}
                    opacity={node.id === clickedNode || clickedNode === null ? 1 : 0}
                    cx={node.x}
                    cy={node.y}
                    r={node.id !== clickedNode ? node.size : 30}
                    transform={ clickedNode === null ? 'none' : node.id === clickedNode
                      ? `translate(${width/2 - node.x - 15}, ${height/2 - node.y - 15})` 
                      : `none`
                    }
                    onMouseEnter={(e) => {
                      setSelectedNode(node.id)
                    }}
                    onMouseOut={(e) => {
                      setSelectedNode(null)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setClickedNode(node.id)
                    }}
                    style={{ pointerEvents: clickedNode === null || node.id === clickedNode ? 'all' : 'none' }}
                  ></circle>
                </g>
              ))
            }
          </g>
        </svg>
        {/* <div>{ tracksInAlbum.map(track => (<h4>{track.name}</h4>)) }</div> */}

      </div>
    </>
  )
}

export default SongsViz