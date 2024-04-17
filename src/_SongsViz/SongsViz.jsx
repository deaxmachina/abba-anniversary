import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import albums from "../data/albums.json"
import * as d3 from 'd3'
import _ from 'lodash'
import './SongsViz.scss'
import selectedSongs from './selectedSongs.js'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
import Eclipse from '../_Eclipse/Eclipse'
import Filters from './Filters'


const SongsViz = ({ selectedAlbumId, colours }) => {
  // Get the tracks in the selected album
  const tracksInAlbum = useMemo(() => {
    console.log('selectedAlbumId', selectedAlbumId)
    return albums.filter(d => d.id === selectedAlbumId)[0].tracks
  }, [selectedAlbumId])

  // Create data for node-link graph 
  // Make sure that every song is connected to at least one more song
  const compulsoryLinks = tracksInAlbum.map(track => {
    const source = track.id
    const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
    return ({ source, target, size: _.sample([0, 0.7, 1.6]) })
  })
  const otherLinks = _.range(6).map(i => {
    const source = _.sample(tracksInAlbum).id
    const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
    return ({ source, target, size: _.sample([0, 0.6, 0.5, 0.7, 1.8, 4])  })
  })
  const allLinks = _.uniqBy([...compulsoryLinks, ...otherLinks], d => `${d.source}-${d.target}`)
  const data = useMemo(() => {
    const data = { 
      nodes: tracksInAlbum.map(track => ({
        ...track, 
        size:  _.find(selectedSongs, d => d.albumId === selectedAlbumId).songs.map(songs => songs.id).includes(track.id) 
          ? 28
          :  _.sample([12, 14, 18]),
        offsets: [
          { x: _.random(-0.06, 0.06), y: _.random(-0.06, 0.06), fill: _.sample([colours.primary1, colours.secondary1]) },
          { x: _.random(-0.06, 0.06), y: _.random(-0.06, 0.06), fill: _.sample([colours.primary1, colours.secondary1]) },
        ]
      })), 
      links: allLinks
    }
    return data
  }, [selectedAlbumId, selectedSongs])


  // Set dimensions of the main svg 
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


  // Define the d3 simulation for node-link graph
  const links = data.links.map(d => ({...d})) // Need a copy of links as the force will modify the array in place
  const nodes = data.nodes.map(d => ({...d})) // Need a copy of nodes as the force will modify the array in place
  const [nodesSimulation, setNodesSimulation] = useState(null)
  const [linksSimulation, setLinksSimulation] = useState(null)
  const simulation = useRef()
  useEffect(() => {
    simulation.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width * 0.5, height * 0.5).strength(1.2))
      .force("x", d3.forceX((d, i) => i * 50).strength(0.5))
      .force("collide", d3.forceCollide().radius(50).strength(0.2))
      .on("tick", () => {
        setNodesSimulation(() => [...nodes])
        setLinksSimulation(() => [...links])
      })
      //.stop(); // Stop the simulation initially
  }, [width, height])

  // Keep track of the songs that have been selected 
  const [selectedNode, setSelectedNode] = useState(null)
  const [clickedNode, setClickedNode] = useState(null)
  // TODO: This should probably be moved inside the player logic 
  const [songUrl, setSongUrl] = useState(null)
  const [audioUrl, setAudioUrl] = useState('')
  const fetchAudio = async (songUrl) => {
    try {
      const response = await fetch(songUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };


  return (
    <>
      <div className="wrapper-viz" ref={wrapperRef} style={{ background: colours.songsVizBg }}>
        {
          !clickedNode &&
            <div className='wrapper-viz-instructions'>
              Click on <div className='example-circle' style={{ background: colours.songStar }}></div> song 
            </div>
        }

        {/* {
          audioUrl &&
          <SongPlayer audioUrl={audioUrl} />
        } */}
        
        <svg className='stars-viz-svg' onClick={(e) => {
          e.stopPropagation()
          //setClickedNode(null)
        }} >

          {/* Filers */}
          <defs>
            <Filters />
          </defs>


          {/* Links */}
          {
            (width > 0 && height > 0 && linksSimulation) && linksSimulation.map((link, i) => (
              <line
                className='link'
                key={`${link.source}-${link.target}-${i}`}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke={colours.goldLight}
                strokeWidth={link.size}
                opacity={clickedNode === null ? 1 : 0}
              ></line>
            ))
          }
          {/* Nodes */}
          <g className='nodes-g' style={{ filter: "url(#glow)" }} >
            {
              (width > 0 && height > 0 && nodesSimulation) && nodesSimulation.map((node, i) => (
                <g className='circle-g' key={`${node.id}`} >
                  <circle
                    cx={node.x * (1 + node.offsets[0].x)}
                    cy={node.y * (1 + node.offsets[0].y)}
                    r={!clickedNode ? node.size*4 : 0}
                    fill={node.offsets[0].fill}
                    opacity={0.1}
                    style={{ mixBlendMode: "screen", filter: "url(#blob-blur)", pointerEvents: 'none' }}
                  />
                  <circle
                    cx={node.x * (1 + node.offsets[1].x)}
                    cy={node.y * (1 + node.offsets[1].y)}
                    r={!clickedNode ? node.size*4 : 0}
                    fill={node.offsets[1].fill}
                    opacity={0}
                    style={{ mixBlendMode: "screen", filter: "url(#blob-blur)", pointerEvents: 'none'   }}
                  />

                  {/* Main circle */}
                  <circle   
                    className='node'
                    fill={ node.id === clickedNode || node.id === selectedNode ? 'url(#radial-gradient)' : colours.songStar}
                    opacity={node.id === clickedNode || clickedNode === null ? 1 : 0}
                    cx={node.x}
                    cy={node.y}
                    r={node.id !== clickedNode ? node.size : 50}
                    transform={ clickedNode === null ? 'none' : node.id === clickedNode
                      ? `translate(${width*0.5 - node.x}, ${height*0.5 - node.y})` 
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
                      const songUrl = audioPreviews.find(d => d.song_id === node.id).song_audioPreview.url
                      setSongUrl(songUrl)
                      fetchAudio(songUrl)
                    }}
                    style={{ pointerEvents: clickedNode === null || node.id === clickedNode ? 'all' : 'none' }}
                  ></circle>
                  
                </g>
              ))
            }
          </g>
          
          {/* Labels for songs */}
          <g className='songs-labels-g' fill={colours.goldLight} >
            {
              (width > 0 && height > 0 && nodesSimulation) && nodesSimulation.map((node, i) => (
                <text
                  className='song-label'
                  key={`${node.id}`}
                  x={node.x}
                  y={node.y}
                  dy={-node.size-5}
                  textAnchor='middle'
                  opacity={node.id === selectedNode ? 1 : 0}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.name}
                </text>
              ))
            }
          </g>
        </svg>

        {/* Spotify metrics for selected song  */}
        {
          clickedNode && audioUrl ?
            <Eclipse 
              width={width} 
              height={height} 
              songId={clickedNode} 
              audioUrl={audioUrl}
              setClickedNode={setClickedNode} 
            />
            : <></>
        }
      </div>
    </>
  )
}

export default SongsViz