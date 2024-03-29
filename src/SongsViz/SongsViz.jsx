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
    nodes: tracksInAlbum, 
    links: _.uniqBy(_.range(25).map(i => {
      const source = _.sample(tracksInAlbum).id
      const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
      return ({ source, target })
    }), d => `${d.source}-${d.target}`)
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
  const [nodesSimulation, setNodesSimulation] = useState([...nodes])
  const [linksSimulation, setLinksSimulation] = useState([...links])
  const simulation = useRef()
  useEffect(() => {
    simulation.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force("collide", d3.forceCollide().radius(50).strength(0.3))
      .on("tick", () => {
        //console.log('tick happened')
        setNodesSimulation(() => [...nodes])
        setLinksSimulation(() => [...links])
      })
      //.stop(); // Stop the simulation initially
  }, [width, height])




  return (
    <>
      <div className="wrapper-viz" ref={wrapperRef} >
        <svg className='stars-viz-svg'>
          {
            (width > 0 && height > 0) && linksSimulation.map((link, i) => (
              <line
                key={`${link.source}-${link.target}-${i}`}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke='#fff'
                strokeWidth={_.sample([0.5, 2, 3.5])}
              ></line>
            ))
          }
          {
            (width > 0 && height > 0) && nodesSimulation.map((node, i) => (
              <circle
                key={`${node.id}`}
                cx={node.x}
                cy={node.y}
                r='10'
                fill='#eeb064'
                stroke='#b38a42'
              ></circle>
            ))
          }
        </svg>
        {/* <div>{ tracksInAlbum.map(track => (<h4>{track.name}</h4>)) }</div> */}

      </div>
    </>
  )
}

export default SongsViz