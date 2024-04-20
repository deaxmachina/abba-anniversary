import audioFeatures from '../data/audio_features_results.json'
import albums from '../data/albums.json'
import { useMemo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'
import p5 from 'p5'
window.p5 = p5
import("p5/lib/addons/p5.sound")


const glowMetricMoons = '#fcedbb' // '#fff'
const glowSongMoon = '#fcedbb' // '#fff'
const colMetricMoons = '#adb3c2' // '#fcedbb' // '#adb3c2'
const colRays = '#ea9918'


const LoadingSketch = ({ windowWidth, windowHeight }) => {
  window.p5 = p5

  const width = windowWidth
  const height = windowHeight
  // Dimensions
  const rMaxMiddleCircle = 150 // Radius for the middle circle = selected song
  const rMinRays = 140 // Min radius of the radial rays coming from the middle for the song viz
  const rMetricCirclesPosition = rMinRays + 10 // where to radially position the circles for the metrics (suns and moons)
  const rMetricCircles = 72 // radius of the suns and moons circles for the metrics

  const canvasRef = useRef()
  const songRef = useRef()

  let songUrl = './08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3'
  let songId = '08GOw3NsrJ0LsCCeyqzt3b' 


  useEffect(() => {
    let fft = null 
    let audioFeaturesSong = null
    const fftBins = 64
    const fftBinCutoff = 41

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

      p.preload = () => {
        songRef.current = p.loadSound(songUrl)
      }

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
        canvas.parent(canvasRef.current)
        p.angleMode(p.DEGREES)

	      fft = new p.constructor.FFT(0.8, fftBins)
        p.background(220)

        const btn = p.select('.hello')
        btn.mousePressed(() => {
          //songRef.current = p.loadSound(songUrl)
          songRef.current.play()
        })
        console.log('btn', btn)

        audioFeaturesSong = audioFeatures.find(d => d.id === songId)

      };



      p.draw = () => {
        p.background(0)
	
        ///////////////////////////////////////////////////
        ///////////// Draw song eclipse graph /////////////
        ///////////////////////////////////////////////////
      	if (!audioFeaturesSong) return 
        p.background(0)
        p.translate(p.width/2, p.height/2)
        
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
            rMaxRays * p.cos(angle-4), rMaxRays * p.sin(angle-4),
            rMaxRays * p.cos(angle), rMaxRays * p.sin(angle)
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
  }, [windowWidth, windowHeight])

  return (
    <div 
      className='wrapper-eclipse' 
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div ref={canvasRef} className='wrapper-sketch-load' style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
        <div className='sketch-overlay'></div>
        <button className='hello'>hello</button>
      </div>
    </div>
  )
}

export default LoadingSketch