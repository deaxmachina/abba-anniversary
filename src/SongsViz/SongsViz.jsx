import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import albums from "./data/albums.json"
import * as d3 from 'd3'
import _ from 'lodash'
import './SongsViz.scss'
import selectedSongs from './selectedSongs.js'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
import SpotifyMetricsViz from '../SpotifyMetricsViz/SpotifyMetricsViz'
import SongPlayer from '../SongPlayer/SongPlayer'


const SongsViz = ({ selectedAlbumId }) => {

  // useEffect(() => {
  //   console.log('selected album data', albums.filter(d => d.id === selectedAlbumId))
  // }, [selectedAlbumId])

  // Get the tracks in the selected album
  const tracksInAlbum = useMemo(() => {
    return albums.filter(d => d.id === selectedAlbumId)[0].tracks
  }, [selectedAlbumId])

  // Create data for node-link graph 
  // Make sure that every song is connected to at least one more song
  const compulsoryLinks = tracksInAlbum.map(track => {
    const source = track.id
    const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
    return ({ source, target, size: _.sample([0.3, 0.7, 1.6]) })
  })
  const otherLinks = _.range(6).map(i => {
    const source = _.sample(tracksInAlbum).id
    const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
    return ({ source, target, size: _.sample([0.3, 0.7, 1.6])  })
  })
  const allLinks = _.uniqBy([...compulsoryLinks, ...otherLinks], d => `${d.source}-${d.target}`)
  const data = { 
    nodes: tracksInAlbum.map(track => ({
      ...track, 
      size:  _.find(selectedSongs, d => d.albumId === selectedAlbumId).songs.map(songs => songs.id).includes(track.id) 
        ? 20 
        :  _.sample([8, 10, 12])
    })), 
    links: allLinks
    // links: _.uniqBy(_.range(12).map(i => {
    //   const source = _.sample(tracksInAlbum).id
    //   const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
    //   return ({ source, target })
    // }), d => `${d.source}-${d.target}`)
    //   .map(link => ({...link, size: _.sample([0.3, 0.7, 1.6])}))
  }

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
      .force("center", d3.forceCenter(width * 0.5, height * 0.4).strength(1.5))
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
      <div className="wrapper-viz" ref={wrapperRef} >
        {
          audioUrl &&
          <SongPlayer audioUrl={audioUrl} />
        }
        
        <svg className='stars-viz-svg' onClick={(e) => {
          e.stopPropagation()
          setClickedNode(null)
        }} >

          {/* Filers */}
          <defs>
            <filter id='glow'>
              <feGaussianBlur stdDeviation='10' result='coloredBlur'></feGaussianBlur>
              <feMerge>
                <feMergeNode in='coloredBlur'></feMergeNode>
                <feMergeNode in='SourceGraphic'></feMergeNode>
              </feMerge>
            </filter>
            <filter id='glow-subtle'>
              <feGaussianBlur stdDeviation='3' result='coloredBlur'></feGaussianBlur>
              <feMerge>
                <feMergeNode in='coloredBlur'></feMergeNode>
                <feMergeNode in='SourceGraphic'></feMergeNode>
              </feMerge>
            </filter>

            <radialGradient id='radial-gradient' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#FFF76B'></stop>
              <stop offset='50%' stopColor='#FFF845'></stop>
              <stop offset='90%' stopColor='#FFDA4E'></stop>
              <stop offset='100%' stopColor='#FB8933'></stop>
            </radialGradient>

            <radialGradient id='radial-gradient-planets' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#3a86ff'></stop>
              <stop offset='100%' stopColor='#8338ec'></stop>
              {/* <stop offset='100%' stopColor='#af2f91'></stop> */}
            </radialGradient>
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
                stroke='#fcedbb'
                strokeWidth={link.size}
                opacity={clickedNode === null ? 1 : 0}
              ></line>
            ))
          }
          {/* Nodes */}
          <g className='nodes-g' style={{ filter: "url(#glow)" }}>
            {
              (width > 0 && height > 0 && nodesSimulation) && nodesSimulation.map((node, i) => (
                <g className='circle-g' key={`${node.id}`} >
                  <circle    
                    className='node'
                    fill={node.id === selectedNode ? '#ea9918' : '#ea9918'}
                    opacity={node.id === clickedNode || clickedNode === null ? 1 : 0}
                    cx={node.x}
                    cy={node.y}
                    r={node.id !== clickedNode ? node.size : 30}
                    transform={ clickedNode === null ? 'none' : node.id === clickedNode
                      ? `translate(${width/2 - node.x}, ${height*0.4 - node.y})` 
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
          {/* Spotify metrics for selected song  */}
          {
            clickedNode !== null &&
            <SpotifyMetricsViz width={width} height={height} />
          }
          

          {/* Labels for songs */}
          <g className='songs-labels-g' >
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
      </div>
    </>
  )
}

export default SongsViz