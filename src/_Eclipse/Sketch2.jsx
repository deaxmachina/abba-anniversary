import p5 from 'p5'
window.p5 = p5
import("p5/lib/addons/p5.sound")


import { useEffect, useRef } from 'react';

const Sketch = ( { width, height, audioUrl }) => {

  window.p5 = p5

  const canvasRef = useRef()
  const songRef = useRef()

  useEffect(() => {
    let song
    // The FFT
    let fft
    const fftBins = 64
    const fftBinCutoff = 41

    const sketch = new p5((p) => {
      // console.log('loadSound', p5Sound)

      p.preload = () => {
        song = p.loadSound(audioUrl)
        songRef.current = p.loadSound(audioUrl)
      }

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        canvas.parent(canvasRef.current);

        // Instantial the fft
	      fft = new p.constructor.FFT(0.8, fftBins)

        p.background(220);
        p.fill(255, 0, 0);
        p.ellipse(p.width/2, p.height/2, 100, 100);

        // // this way works too
        // const btn = p.createButton('click meee')
        // btn.position(50, 100)
        // btn.mousePressed(() => {
        //   if (song) {
        //     song.play()
        //   }
        // })

      };

      p.draw = () => {
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
    <div ref={canvasRef} className='wrapper-sketch' style={{ width: `${width}px`, height: `${height}px`, background: 'red', position: 'relative' }}>
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
    </div>
  )
}

export default Sketch;