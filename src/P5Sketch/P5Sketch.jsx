import './P5Sketch.scss'
import { selectedSongs } from './selectedSongs.js'
import audioFeatures from '../data/audio_features_results.json'
import albums from '../data/albums.json'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
import { useMemo, useEffect, useState, useRef } from 'react'
import SpotifyExplanation from './SpotifyExplanation.jsx'
import _ from 'lodash'
import gsap from 'gsap'
import * as d3 from 'd3'
import p5 from 'p5'
window.p5 = p5
import("p5/lib/addons/p5.sound")


const glowMetricMoons = '#fcedbb' // '#fff'
const glowSongMoon = '#fcedbb' // '#fff'
const colMetricMoons = '#adb3c2' // '#fcedbb' // '#adb3c2'
const colRays = '#ea9918'


const P5Sketch = ({ windowWidth, windowHeight, selectedAlbumId, colours, mum, fullSongPreview }) => {
  window.p5 = p5

  const [songModeActive, setSongModeActive] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const width = windowHeight * 0.7
  const height = windowHeight * 0.7
  // Dimensions
  const rMaxMiddleCircle =  width >= 550 ? 150 : 120 // Radius for the middle circle = selected song
  const rMinRays = width >= 550 ? 140 : 120 // Min radius of the radial rays coming from the middle for the song viz
  const rMetricCirclesPosition = rMinRays + 10 // where to radially position the circles for the metrics (suns and moons)
  const rMetricCircles = 74 // radius of the suns and moons circles for the metrics

  const canvasRef = useRef()
  const songRef = useRef()

  // Get tracks in current album 
  const tracksInAlbum = albums.find(d => d.id === selectedAlbumId).tracks

  // For the dummy gooey circles 
  const randomCircles = useMemo(() => {
      return  _.range(40).map(i => {
        // Top edge 
        const xTop = Math.random() * width 
        const yTop = _.random(0, 0.15) * height
        // Bottom edge 
        const xBottom = Math.random() * width 
        const yBottom = _.random(0.85, 1.1) * height
        // Left edge 
        const xLeft = _.random(0.85, 1) * width
        const yLeft = Math.random() * height
        // Right edge 
        const xRight = _.random(0, 0.15) * width
        const yRight = Math.random() * height
        // All the options 
        const options = [
          // { x: xTop, y: yTop },
          { x: xBottom, y: yBottom },
          // { x: xLeft, y: yLeft },
          // { x: xRight, y: yRight }
        ]
        const option = _.sample(options)
        const x = option.x
        const y = option.y
        const r = Math.round(_.random(20, 80))
        const fill = _.sample([colours.primary1, colours.secondary1, '#adb3c2'])
        const fillOpacity = _.random(0.2, 0.6)
        return { x, y, r, fill, fillOpacity }
      })
  }, [width, height, colours])

  useEffect(() => {
    let fft = null 
    let songUrl = null
    let songId = null 
    let songName = null
    let songSpotifyLink = null
    let songNameOnHover = null
    let audioFeaturesSong = null
    const fftBins = 64
    const fftBinCutoff = 41

    let buttonPlayPause
    let buttonExitSongs
    let songSpotifyLinkEl 
    
    let graphData = null
    let links = null
    let nodes = null
    let simulation = null
    let nodesSimulation = null
    let linksSimulation = null
    let animationIsActive = false
    const fontFamily = 'Dawning of a New Day' // 'Dawning of a New Day'
    const metricsOptions = ['loudness', 'tempo', 'energy', 'danceability', 'valence']


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

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
        canvas.parent(canvasRef.current)
        p.angleMode(p.DEGREES)

	      fft = new p.constructor.FFT(0.8, fftBins)

      	////////////////////////////////////////////
        ///////// Nodes and Links creation /////////
        ////////////////////////////////////////////
        // Create data for node-link graph 
        // Make sure that every song is connected to at least one more song
        const compulsoryLinks = tracksInAlbum.map(track => {
          const source = track.id
          const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
          return ({ source, target, size: _.sample([0, 0.5, 1, 2.5]) })
        })
        // Thow in some more random links for funsies
        const otherLinks = _.range(6).map(i => {
          const source = _.sample(tracksInAlbum).id
          const target = _.sample(tracksInAlbum.filter(d => d.id !== source)).id
          return ({ source, target, size: _.sample([0, 0.5, 1, 2.5])  })
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
          .force("center", d3.forceCenter(width * 0.5, height * 0.4).strength(1.2))
          //.force("x", d3.forceX((d, i) => i * 50).strength(0.5))
          .force("collide", d3.forceCollide().radius(width >= 550 ? 50 : 40).strength(0.2))
          .on("tick", () => {
            nodesSimulation = [...nodes]
            linksSimulation = [...links]
          })


        ///////////////////////////////////////////
        ///////////// Button controls /////////////
        ///////////////////////////////////////////
        // Play / pause button
        buttonPlayPause = p.select('.toggle-btn')
        buttonPlayPause.html('<div class="pause-button"></div>')
        buttonPlayPause.mousePressed(() => {
          console.log('clicked on the play pause btn')
          if (songRef.current) {
            if (songRef.current.isPlaying()) {
              console.log('song is playing')
              songRef.current.pause()
              buttonPlayPause.html('<div class="play-button"></div>')
            } else {
              console.log('song is NOT playing')
              songRef.current.play()
              buttonPlayPause.html('<div class="pause-button"></div>')
            }
          }
        })

        // Button to set song to null 
        buttonExitSongs = p.select('.exit-songs-btn')
        buttonExitSongs.addClass('hide')
        buttonExitSongs.removeClass('show')
        buttonExitSongs.mousePressed(() => {
          if (songRef.current) songRef.current.pause()
          songRef.current = songUrl = songId = audioFeaturesSong = songName = songNameOnHover = songSpotifyLink = null
          setSongModeActive(false)
          // Hide the play / pause button 
          buttonPlayPause.removeClass('show')
          buttonPlayPause.addClass('hide')
          buttonPlayPause.html('<div class="pause-button"></div>')
          songSpotifyLinkEl.addClass('hide')
          songSpotifyLinkEl.removeClass('show')
        })

        // Container for the spotify song link
        songSpotifyLinkEl = p.select('.spotify-link-el')
        songSpotifyLinkEl.attribute('href', 'https://www.example.com')

        p.background(220)

      };


      //////////////////////////////////////////////
      // Show the song name on mouse over of node //
      //////////////////////////////////////////////
      p.mouseMoved = () => {
        if (songRef.current) return // Only want to allow clicks in the graph mode
        if (!songId) songNameOnHover = null
        const distCondition = (node) => p.dist(p.mouseX, p.mouseY, node.x, node.y) <= node.size/2
        if (nodesSimulation) {
          nodesSimulation.forEach(node => {
            if (distCondition(node)) {
              songNameOnHover = node.name
              p.cursor(p.CROSS)
            } else {
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
            songName = node.name
            songSpotifyLink = node.spotify_track_link
            songUrl = audioPreviews.find(d => d.song_id === node.id).song_audioPreview.url
            if (songRef.current) songRef.current.pause() // pause the previous song first
            setSongModeActive(true)
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
                    size: rMaxMiddleCircle*0.8,
                    col: '#000000',
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
            if (node.name === songNameOnHover) {
              p.textAlign(p.CENTER)
              p.textFont(fontFamily)
              p.textStyle(p.BOLD)
              p.textSize(20)
              p.text(songNameOnHover, node.x, node.y - node.size * 0.5 - 10)
            }
          })       
        }

        ///////////////////////////////////////////////////
        // Draw song eclipse graph when song is selected //
        ///////////////////////////////////////////////////
      	if (!audioFeaturesSong) return 

        // Only in the mode where we want to limit the song duration !!!
        // Stop and reset the song after 15 seconds
        //console.log(songRef.current.currentTime())
        if (songRef.current.currentTime() > 5) {
          songRef.current.jump(0)
          songRef.current.pause()
        }


        p.background(0)
        p.translate(p.width/2, p.height/2)
        // Show the play / pause button and exit songs button
        buttonPlayPause.removeClass('hide')
        buttonPlayPause.addClass('show')
        buttonExitSongs.removeClass('hide')
        buttonExitSongs.addClass('show')
        songSpotifyLinkEl.addClass('show')
        songSpotifyLinkEl.removeClass('hide')
        
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
          const rMaxRays = p.map(amplitude, 0, 255, rMinRays, p.width/2)
          raysCol.setAlpha(amplitude*1)
          p.fill(raysCol)
          p.quad(
            rMinRays * p.cos(angle), rMinRays * p.sin(angle),
            rMinRays * p.cos(angle-1), rMinRays * p.sin(angle-1),
            rMaxRays * p.cos(angle-2), rMaxRays * p.sin(angle-2),
            rMaxRays * p.cos(angle+2), rMaxRays * p.sin(angle+2)
          )
        }
        p.pop()

        // Draw the sun and moon in the middle for the song (bass)
        p.push()
        drawBlurryCircle(0, 0, rMaxMiddleCircle*0.4, glowSongMoon)
        p.fill('#000')
        const freqForOption = fft.getEnergy('bass')
        p.circle(0, 0, p.map(freqForOption, 0, 255, 20, rMaxMiddleCircle))
        p.pop()

        // Draw the sun and moons for each of the metrics
        p.push()
        // Suns (bright)
        metricsOptions.forEach((metric, i) => {		
          const angle = (360 / metricsOptions.length) * i
          const x = p.cos(angle) * rMetricCirclesPosition
          const y = p.sin(angle) * rMetricCirclesPosition
          drawBlurryCircle(x, y, rMetricCircles*0.5, glowMetricMoons)
          p.fill(colMetricMoons)
          p.noStroke()
          p.circle(x, y, rMetricCircles)
        })
        // Moons (black)
        metricsOptions.forEach((metric, i) => {
          const rawValue = audioFeaturesSong[metric]
          let offset
          // moved by an angle equivalent to the diameter of the circle
          const maxAngleToShiftBy = p.atan(rMetricCirclesPosition / (rMetricCircles*2))
          if (['energy', 'danceability', 'valence'].includes(metric)) {
            offset = p.map(rawValue, 0, 1, 0, maxAngleToShiftBy/2) // metric 0 -> offset 0; metric 1 -> offset = radius
          } else if (metric === 'loudness') {
            offset = p.map(rawValue, d3.min(audioFeatures, d => d.loudness), d3.max(audioFeatures, d => d.loudness), 0, maxAngleToShiftBy/2) 
          } else if (metric === 'tempo') {
            offset = p.map(rawValue, 0, 200, 0, maxAngleToShiftBy/2)
          }
          const angle = (360 / metricsOptions.length) * i + offset 
          const x = p.cos(angle) * rMetricCirclesPosition
          const y = p.sin(angle) * rMetricCirclesPosition   
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
          p.textSize(26)
          p.text(songName, 0, -height * 0.4)
          p.pop()
        }

        // Set the spotify link 
        songSpotifyLinkEl.attribute('href', songSpotifyLink)

      }


    })

    return () => {
      // Clean up p5.js sketch
      if (songRef.current) {
        songRef.current.pause()
        songRef.current = null
        buttonExitSongs.addClass('hide')
        buttonExitSongs.removeClass('show')
        buttonPlayPause.addClass('hide')
        buttonPlayPause.removeClass('show')
      }
      sketch.remove()
    };
  }, [selectedAlbumId, windowWidth, windowHeight])

  return (
    <div 
      className='wrapper-eclipse' 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div ref={canvasRef} className='wrapper-sketch' style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
        <button className='toggle-btn hide'></button>
        <button className='exit-songs-btn hide'>&larr; {
          mum ? 'назад' : 'back'
        }</button>
        <svg 
          className='svg-gooey-blobs' 
          filter='url(#gooeyCodeFilter)'
        >
          <defs>
            <filter id='gooeyCodeFilter'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='10' colorInterpolationFilters='sRGB' result='blur'/>
              <feColorMatrix className="blurValues" in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='gooey' />
              <feComposite in='SourceGraphic' in2='gooey' operator='atop' />
            </filter>
          </defs>
          {
            !songModeActive && randomCircles.map((d, i) => {
              return (
                <circle 
                  key={d.x}
                  className='decorative-blob'
                  cx={d.x} 
                  cy={d.y} 
                  r={d.r} 
                  fill={d.fill}
                  fillOpacity={d.fillOpacity}
                />
              )
            })
          }
        </svg>

        {/* Explanation for the circles */}
        {
          !songModeActive &&
          <div className='circles-explanation'>
            { mum ? 'кликни на песен' : 'click song' }
          <div className='song-circle'></div>
          </div>
        }

        {/* Explanation of the graph */}
        {
          songModeActive &&
          <button 
            className='explain-graph-btn'
            onClick={() => setShowExplanation(prev => !prev)}
          >
            { showExplanation ? 'x' : ( mum ? 'какво означава?' : 'about ?' ) }
          </button>
        }
        {
          showExplanation && songModeActive &&
          <SpotifyExplanation mum={mum} />
        }

        {/* Link to Spotify for song */}
        <a 
          className='spotify-link-el hide' 
          target='_blank'
        >
          <img src='115772_vynil_disk_icon.png' width='18px' height='18px'></img>
          <span>Spotify link</span>
        </a>

        {/* Noisy overlay */}
        <div className='sketch-overlay'></div>
      </div>
    </div>
  )
}

export default P5Sketch