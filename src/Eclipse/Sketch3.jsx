import Sketch from "react-p5";
import("p5/lib/addons/p5.sound.js");
import { useEffect, useRef } from "react";

const MySketch = ({ audioUrl, songUrl, width, height }) => {
  let x = 0;
  let y = 0;

  let button 
  let song

  const canvasParentRef = useRef()

  const preload = (p5) => {
    //song = p5.loadSound('./08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3')
  }

  const setup = (p5) => {
    p5.createCanvas(width, height).parent(canvasParentRef.current);

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

  }

  const draw = (p5) => {
    p5.background(100);
    p5.rectMode(p5.CENTER)
    p5.rect(width/2, height/2, 100, 100)
    p5.ellipse(x, y, 70, 70);
    x++;
    y++
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