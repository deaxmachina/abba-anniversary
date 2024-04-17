import p5 from 'p5'
// window.p5 = p5
//import("p5/lib/addons/p5.sound")


import { useEffect, useRef } from 'react';

const Sketch = ( { width, height, audioUrl }) => {

  window.p5 = p5
  console.log('p5', p5)

  const canvasRef = useRef()

  useEffect(() => {
    let song

    const sketch = new p5((p) => {
      // console.log('loadSound', p5Sound)

      p.preload = () => {
        song = p.loadSound(audioUrl)
      }

      p.setup = () => {
        // Get reference to the existing canvas element
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        canvas.parent(canvasRef.current);
        p.background(220);
        p.fill(255, 0, 0);
        p.ellipse(p.width/2, p.height/2, 100, 100);
      };

      p.draw = () => {
        // Your draw code goes here (if needed)
      }
    })

    return () => {
      // Clean up p5.js sketch
      sketch.remove()
    };
  }, [])

  return (
    <div ref={canvasRef} className='wrapper-sketch' style={{ width: `${width}px`, height: `${height}px`, background: 'red' }}>
    </div>
  )
}

export default Sketch;