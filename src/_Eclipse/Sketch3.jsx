import Sketch from "react-p5";
import("p5/lib/addons/p5.sound.js");
import { useEffect, useRef } from "react";
import audioFeatures from '../data/audio_features_results.json'

const glowMetricMoons = '#fcedbb' // '#fff'
const glowSongMoon = '#fcedbb' // '#fff'
const colMetricMoons = '#adb3c2' // '#fcedbb' // '#adb3c2'
const colRays = '#ea9918'

const MySketch = ({ audioUrl, songUrl, width, height, songId }) => {
  let x = 0;
  let y = 0;

  let audioFeaturesSong
  let button 
  let song
  let fft
  const fftBins = 64
  const fftBinCutoff = 41
  const angleOffsets = []

  const canvasParentRef = useRef()

  const preload = (p5) => {
    //song = p5.loadSound(audioUrl)
  }

  const setup = (p5) => {
    p5.createCanvas(width, height).parent(canvasParentRef.current)
    p5.angleMode(p5.DEGREES)

    song = p5.loadSound(songUrl, () => { 
      console.log('The song was loaded', audioUrl)
      song.play() 
    })

    button = p5.createButton("Toggle audio")
    button.position(0, 100)
    button.mousePressed(() => {
      if (!song.isPlaying()) {
        song.play();
      } else {
        song.pause();
      }
    })

    //fft = new p5.constructor.FFT(0.8, fftBins)
    audioFeaturesSong = audioFeatures.find(d => d.id === songId)
    for (let i=0; i<6; i++) {
      angleOffsets.push(p5.random(7, 15))
    }
  }

  const draw = (p5) => {
    // p5.background(100);
    // p5.rectMode(p5.CENTER)
    // p5.rect(width/2, height/2, 100, 100)
    // p5.ellipse(x, y, 70, 70);
    // x++;
    // y++

    p5.background(0)
    p5.translate(p5.width/2, p5.height/2)

    p5.fill('pink')
    p5.quad(100, 100, 300, 100, 300, 300, 100, 300)
    
    fft = new p5.constructor.FFT(0.8, fftBins)
    //console.log('fft', fft)
    if (fft) {
      //console.log('fft', fft)
      const spectrum = fft.analyze()
      const reducedSpectrum = spectrum.slice(0, fftBinCutoff)
      console.log('reducedSpectrum', reducedSpectrum)

      p5.push()
      const raysCol = p5.color(colRays)
      p5.strokeWeight(1)
      for (let i=0; i < reducedSpectrum.length; i++) {
        const amplitude = reducedSpectrum[i] // This is from 0 to 255 
        const angle = p5.map(i, 0, reducedSpectrum.length, 0, 360)
        const rMin = 170// 170
        const rMax = p5.map(amplitude, 0, 255, rMin, 600)
        raysCol.setAlpha(amplitude*1)
        p5.fill('#fff')
        // p5.quad(
        //   rMin * p5.cos(angle), rMin * p5.sin(angle),
        //   rMin * p5.cos(angle-1), rMin * p5.sin(angle-1),
        //   rMax * p5.cos(angle-4), rMax * p5.sin(angle-4),
        //   rMax * p5.cos(angle), rMax * p5.sin(angle)
        // )
        p5.circle(0, 0, rMax)
      }
      p5.pop()
    }
  };


  return (
    <div ref={canvasParentRef} className='wrapper-sketch' style={{ width: `${width}px`, height: `${height}px`, background: 'red' }}>
      <Sketch 
        preload={preload} 
        setup={setup} 
        draw={draw} 
      />
    </div>

  )

}

export default MySketch