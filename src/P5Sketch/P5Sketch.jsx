import './P5Sketch.scss'
import { selectedSongs } from './selectedSongs.js'
import audioFeatures from '../data/audio_features_results.json'
import albums from '../data/albums.json'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
import { useMemo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import gsap from 'gsap'
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
    let songUrl = null
    let songId
    let songName
    let clickedNodeId = null
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
    let animationIsActive = false
    const fontFamily = 'Dawning of a New Day' // 'Dawning of a New Day'
    const metricsOptions = ['loudness', 'tempo', 'energy', 'danceability', 'valence']

    // Dimensions
    const w = 650
    const h = 650
    const maxRMiddleCircle = 150 // Radius for the middle circle = selected song

    const sketch = new p5((p) => {

      const drawBlurryCircle = (x, y, r, col) => {
        p.noStroke()
        const theFill = p.color(col)
        theFill.setAlpha(6)
        p.fill(theFill);
        for(let i = 0; i < r; i++){
          p.circle(x, y, i*3);
        }
      }

      p.preload = () => {
        //songRef.current = p.loadSound(audioUrl)
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
          console.log('play pause button is clicked')
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
        buttonExitSongs.addClass('hide')
        buttonExitSongs.removeClass('show')
        buttonExitSongs.mousePressed(() => {
          if (songRef.current) songRef.current.pause()
          songRef.current = songUrl = songId = audioFeaturesSong = clickedNodeId = songName = null
          // Hide the play / pause button 
          buttonPlayPause.removeClass('show')
          buttonPlayPause.addClass('hide')
        })

        p.background(220)

      };



      //////////////////////////////////////////////
      // Show the song name on mouse over of node //
      //////////////////////////////////////////////
      p.mouseMoved = () => {
        if (songRef.current) return // Only want to allow clicks in the graph mode
        if (!songId) songName = null
        if (nodesSimulation) {
          nodesSimulation.forEach(node => {
            if (p.dist(p.mouseX, p.mouseY, node.x, node.y) <= node.size/2) {
              songName = node.name
            } 
          })
        }
      }



      ////////////////////////////////////////////
      /// Set the song on mousePressed of node ///
      ////////////////////////////////////////////
      p.mousePressed = () => {
        if (songRef.current) return // Only want to allow clicks in the graph mode
        if (!nodesSimulation) return // Need to have the nodesSimulation
        nodesSimulation.forEach(node => {
          if (p.dist(p.mouseX, p.mouseY, node.x, node.y) <= node.size/2) {
            songId = node.id
            clickedNodeId = node.id
            songName = node.name
            songUrl = audioPreviews.find(d => d.song_id === node.id).song_audioPreview.url
            if (songRef.current) songRef.current.pause() // pause the previous song first
            
            // Check if node has been selected and draw circle to the middle 
            // for it if so, deleting everything else 
            nodesSimulation.forEach(node => {
              if (clickedNodeId === node.id) {
                const clonedNode = Object.assign({}, node) // Clone the node so that the OG node stays in place
                gsap.timeline()
                  .fromTo(clonedNode, 
                  { 
                    x: clonedNode.x, 
                    y: clonedNode.y,
                    size: clonedNode.size, 
                    col: clonedNode.col,
                  }, 
                  { 
                    x: p.width/2, 
                    y: p.height/2, 
                    size: maxRMiddleCircle*0.8,
                    col: 'black',
                    //duration: 0.8,
                    onUpdate: () => { 
                      animationIsActive = true
                      // Create the whole scene with a black rect
                      p.fill(0)
                      p.rect(0, 0, p.width, p.height)
                      // Draw the blurry circle moving behind the main circle
                      drawBlurryCircle(clonedNode.x, clonedNode.y, clonedNode.size * 0.5, glowSongMoon)
                      // Draw the main circle with updating fill and position
                      p.fill(clonedNode.col)
                      p.circle(clonedNode.x, clonedNode.y, clonedNode.size) 
                    },
                    onComplete: () => { animationIsActive = false },
                    duration: 1
                  },

                )	
              }
            })
            // Wait a bit before playing song for the node graph to shift its form 
            // so that the selected song is in the middle
            setTimeout(() => {
              // load the new song and play when it's ready 
              songRef.current = p.loadSound(songUrl, () => {
                songRef.current.setVolume(0.1)
                songRef.current.play()
                  audioFeaturesSong = audioFeatures.find(d => d.id === songId)
              })
            }, 1000)
            
          }
        })
      }






      p.draw = () => {
        p.background(0)
	
        ///////////////////////////////////////////////////
        // Draw nodes simulation before song is selected //
        ///////////////////////////////////////////////////
        // This is what happens before a song is clicked
        if (!songRef.current && !animationIsActive && linksSimulation && nodesSimulation) {
          // Hide the exit songs btn if we're showing the graph
          buttonExitSongs.addClass('hide')
          buttonExitSongs.removeClass('show')
          
          // Draw the lines for the nodes
          linksSimulation.forEach(link => {
            p.stroke(glowMetricMoons)
            p.strokeWeight(link.size)
            p.line(link.source.x, link.source.y, link.target.x, link.target.y)
          })
          // Draw circles for the nodes 
          nodesSimulation.forEach(node => {
            // Add blurry circles behind the node circles
            drawBlurryCircle(node.x, node.y, node.size * 0.7, glowSongMoon)
            // Circle for each node on top of the blurry circles
            p.fill(colRays)
            p.circle(node.x, node.y, node.size)
            // Draw song name for hovered song
            if (node.name === songName) {
              p.textAlign(p.CENTER)
              p.textFont(fontFamily)
              p.textStyle(p.BOLD)
              p.textSize(20)
              p.text(songName, node.x, node.y - node.size * 0.5 - 10)
            }
          })       
        }


      	if (!audioFeaturesSong) return 
        p.background(0)
        p.translate(p.width/2, p.height/2)
        // Show the play / pause button and exit songs button
        buttonPlayPause.removeClass('hide')
        buttonPlayPause.addClass('show')
        buttonExitSongs.removeClass('hide')
        buttonExitSongs.addClass('show')
        
        // Get the spectrum fro the fft analyze method and restrict the range 
        const spectrum = fft.analyze()
        const reducedSpectrum = spectrum.slice(0, fftBinCutoff)  

        // Draw rays in a circle that correspond to amplitudes at different frequencies
        p.push()
        const raysCol = p.color(colRays)
        p.strokeWeight(1)
        for (let i=0; i < reducedSpectrum.length; i++) {
          const amplitude = reducedSpectrum[i] // This is from 0 to 255 
          const angle = p.map(i, 0, reducedSpectrum.length, 0, 360)
          const rMin = 150
          const rMax = p.map(amplitude, 0, 255, rMin, width/2)
          raysCol.setAlpha(amplitude*1)
          p.fill(raysCol)
          p.quad(
            rMin * p.cos(angle), rMin * p.sin(angle),
            rMin * p.cos(angle-1), rMin * p.sin(angle-1),
            rMax * p.cos(angle-4), rMax * p.sin(angle-4),
            rMax * p.cos(angle), rMax * p.sin(angle)
          )
        }
        p.pop()

        // Draw the sun and moon in the middle for the song
        p.push()
        drawBlurryCircle(0, 0, maxRMiddleCircle*0.4, glowSongMoon)
        p.fill('#000')
        const freqForOption = fft.getEnergy('bass')
        p.circle(0, 0, p.map(freqForOption, 0, 255, 20, maxRMiddleCircle))
        p.pop()

        // Draw the sun and moons for each of the metrics
        p.push()
        const outerRadius = 140
        // Moons
        const rMetricCircles = 72
        metricsOptions.forEach((metric, i) => {		
          const angle = (360 / metricsOptions.length) * i
          const x = p.cos(angle) * outerRadius
          const y = p.sin(angle) * outerRadius
          drawBlurryCircle(x, y, rMetricCircles*0.5, glowMetricMoons)
          p.fill(colMetricMoons)
          p.noStroke()
          p.circle(x, y, rMetricCircles)
        })
        // Suns
        metricsOptions.forEach((metric, i) => {
          const rawValue = audioFeaturesSong[metric]
          let offset
          if (['energy', 'danceability', 'valence'].includes(metric)) {
            offset = p.map(rawValue, 0, 1, 0, 30) // 0 -> metric is 0; 30 -> metric is 1
          } else if (metric === 'loudness') {
            offset = p.map(rawValue, d3.min(audioFeatures, d => d.loudness), d3.max(audioFeatures, d => d.loudness), 0, 30) 
          } else if (metric === 'tempo') {
            offset = p.map(rawValue, 0, 200, 0, 30)
          }
          const angle = (360 / metricsOptions.length) * i + offset 
          const x = p.cos(angle) * outerRadius
          const y = p.sin(angle) * outerRadius
          
          // eclipsing circle
          p.fill('#000')
          p.noStroke()
          p.circle(x, y, rMetricCircles)
          
          // text with metric value
          p.push()
          p.fill(colMetricMoons)
          p.textAlign(p.CENTER)
          p.textStyle(p.BOLD)
          if (['energy', 'danceability', 'valence'].includes(metric)) {
            p.text(rawValue.toFixed(2), x, y+12)
          } else if (metric === 'loudness') {
            p.text(`${rawValue.toFixed(1)}dB`, x, y+12)
          } else if (metric === 'tempo') {
            p.text(`${rawValue.toFixed(0)}bpm`, x, y+12)
          }
          p.pop()
          
          // text with metric name
          p.push()
          p.fill(colMetricMoons)
          p.textAlign(p.CENTER)
          p.textStyle(p.NORMAL)
          p.textFont(fontFamily)
          p.textSize(16)
          p.translate(0, -5)
          p.text(metric, x, y)
          p.pop()
        })
        p.pop()

        // Name of the song 
        if (songName) {
          p.push()
          p.fill(colRays)
          p.textSize(30)
          p.text(songName, 0, -height * 0.35)
          p.pop()
        }

      }


    })

    return () => {
      // Clean up p5.js sketch
      if (songRef.current) {
        songRef.current.pause()
        songRef.current = null
      }
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

        <button class='toggle-btn hide'>pl</button>
        <button class='exit-songs-btn hide'>bk</button>

        <div className='sketch-overlay'></div>
      </div>
    </div>
  )
}

export default P5Sketch