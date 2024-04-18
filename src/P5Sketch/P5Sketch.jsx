import './P5Sketch.scss'
import { selectedSongs } from './selectedSongs.js'
import audioFeatures from '../data/audio_features_results.json'
import albums from '../data/albums.json'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
import { useMemo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'
import p5 from 'p5'
window.p5 = p5
import("p5/lib/addons/p5.sound")

const selectedAlbumId = '1kM6xcSYO5ASJaWgygznL7' // '0uUtGVj0y9FjfKful7cABY'

const glowMetricMoons = '#fcedbb' // '#fff'
const glowSongMoon = '#fcedbb' // '#fff'
const colMetricMoons = '#adb3c2' // '#fcedbb' // '#adb3c2'
const colRays = '#ea9918'

const width = 660
const height = 660
const audioUrl = './08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3'

const P5Sketch = () => {
  window.p5 = p5

  const canvasRef = useRef()
  const songRef = useRef()

  // Get tracks in current album 
  const tracksInAlbum = albums.find(d => d.id === selectedAlbumId).tracks

  useEffect(() => {
    let fft
    let songId
    let audioFeaturesSong
    const fftBins = 64
    const fftBinCutoff = 41

    let buttonPlayPause
    let buttonExitSongs
    
    let graphData = null
    let links = null
    let nodes = null
    let simulation = null
    let nodesSimulation = null
    let linksSimulation = null

    const sketch = new p5((p) => {

      p.preload = () => {
        songRef.current = p.loadSound(audioUrl)
      }

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
        canvas.parent(canvasRef.current)
        p.angleMode(p.DEGREES)

        // Instantial the fft
	      fft = new p.constructor.FFT(0.8, fftBins)


      	////////////////////////////////////////////
        ///////// Nodes and Links creation /////////
        ////////////////////////////////////////////
        // Create data for node-link graph 
        // Make sure that every song is connected to at least one more song
        const compulsoryLinks = tracksInAlbum.map(track => {
          const source = track.id
          const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
          return ({ source, target, size: _.sample([0, 0.7, 1.6]) })
        })
        // Thow in some more random links for funsies
        const otherLinks = _.range(6).map(i => {
          const source = _.sample(tracksInAlbum).id
          const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
          return ({ source, target, size: _.sample([0, 0.6, 0.5, 0.7, 1.8, 4])  })
        })
        const allLinks = _.uniqBy([...compulsoryLinks, ...otherLinks], d => `${d.source}-${d.target}`)
        const data = { 
          nodes: tracksInAlbum.map(track => ({
              ...track, 
              size:  _.find(selectedSongs, d => d.albumId === selectedAlbumId).songs.map(songs => songs.id).includes(track.id) 
                ? 60
                :  _.sample([25, 30, 40]),
              col: colRays,
          })), 
          links: allLinks
        }
        graphData = data
        links = graphData.links.map(d => ({...d})) // Need a copy of links as the force will modify the array in place
        nodes = graphData.nodes.map(d => ({...d})) // Need a copy of nodes as the force will modify the array in place


        ////////////////////////////////////////////
        ///////////// Force simulation /////////////
        ////////////////////////////////////////////
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width * 0.5, height * 0.5).strength(1.2))
          .force("x", d3.forceX((d, i) => i * 50).strength(0.5))
          .force("collide", d3.forceCollide().radius(50).strength(0.2))
          .on("tick", () => {
            nodesSimulation = [...nodes]
            linksSimulation = [...links]
          })


        ///////////////////////////////////////////
        ///////////// Button controls /////////////
        ///////////////////////////////////////////
        // Play / pause button
        buttonPlayPause = p.select('.toggle-btn')
        buttonPlayPause.html('pa')
        buttonPlayPause.mousePressed(() => {
          if (songRef.current) {
            if (songRef.current.isPlaying()) {
              songRef.current.pause()
              buttonPlayPause.html('pl')
            } else {
              songRef.current.play()
              buttonPlayPause.html('pa')
            }
          }
        })

        // Button to set song to null 
        buttonExitSongs = p.select('.exit-songs-btn')
        // buttonExitSongs.addClass('hide')
        // buttonExitSongs.removeClass('show')
        buttonExitSongs.mousePressed(() => {
          if (songRef.current) songRef.current.pause()
          songRef.current = songUrl = songId = audioFeaturesSong = clickedNodeId = songName = null
          // Hide the play / pause button 
          // buttonPlayPause.removeClass('show')
          // buttonPlayPause.addClass('hide')
        })

        p.background(220)

      };

      p.draw = () => {
        p.background(0)
        // Get the spectrum fro the fft analyze method and restrict the range 
        const spectrum = fft.analyze()
        const reducedSpectrum = spectrum.slice(0, fftBinCutoff)
        // Draw rays in a circle that correspond to amplitudes at different frequencies
        const raysCol = 'orange'
        p.strokeWeight(1)
        for (let i=0; i < reducedSpectrum.length; i++) {
          const amplitude = reducedSpectrum[i] // This is from 0 to 255 
          const angle = p.map(i, 0, reducedSpectrum.length, 0, 360)
          const rMin = 150
          const rMax = p.map(amplitude, 0, 255, rMin, p.width/2)
          p.fill(raysCol)
          p.circle(p.width/2, p.height/2, rMax)
        }
      }
    })

    return () => {
      // Clean up p5.js sketch
      songRef.current.pause()
      songRef.current = null
      sketch.remove()
    };
  }, [audioUrl])

  return (
    <div 
      className='wrapper-eclipse' 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div ref={canvasRef} className='wrapper-sketch' style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
        {/* <button
          style={{ position: 'absolute', top: '0px', left: '0px' }}
          onClick={() => {
            if (songRef.current) {
              if (songRef.current.isPlaying()) {
                songRef.current.pause()
              } else {
                songRef.current.play()
              }
            }
          }}
        >soo0000ong</button> */}

        <button class='toggle-btn'>pl</button>
        <button class='exit-songs-btn'>bk</button>

        <div className='sketch-overlay'></div>
      </div>
    </div>
  )
}

export default P5Sketch