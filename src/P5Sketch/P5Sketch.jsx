import './P5Sketch.scss'
import audioFeatures from '../data/audio_features_results.json'
import albums from '../data/albums.json'
import audioPreviews from '../data/songs_coverArt_and_audioPreviews.json'
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

const width = 660
const height = 660
const audioUrl = './08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3'

const P5Sketch = () => {
  window.p5 = p5

  const canvasRef = useRef()
  const songRef = useRef()

  useEffect(() => {
    let song
    let fft
    const fftBins = 64
    const fftBinCutoff = 41
    let texture

    const sketch = new p5((p) => {
      // console.log('loadSound', p5Sound)

      p.preload = () => {
        song = p.loadSound(audioUrl)
        songRef.current = p.loadSound(audioUrl)
        texture = p.loadImage('texture.jpg');
      }

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
        canvas.parent(canvasRef.current)
        p.angleMode(p.DEGREES)

        // Instantial the fft
	      fft = new p.constructor.FFT(0.8, fftBins)


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
        <button
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
        >soo0000ong</button>
        <div className='sketch-overlay'></div>
      </div>
    </div>
  )
}

export default P5Sketch