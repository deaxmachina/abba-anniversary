import Sketch from "react-p5";
import("p5/lib/addons/p5.sound.js");
import { useEffect } from "react";


export default ({ canvasParentRef, audioUrl, width, height }) => {
  let x = 0;
  let y = 0;

  let button 
  let song

  useEffect(() => {
    console.log('loaded....', canvasParentRef)
  }, [])

  const preload = (p5) => {
    song = p5.loadSound(audioUrl)
  }

  const setup = (p5) => {
    p5.createCanvas(width, height).parent(canvasParentRef.current);

    button = p5.createButton("Toggle audio")
    button.position(0, 100)

    button.mousePressed(() => {
      if (!song) {
        const songPath = audioUrl // './08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3'
        song = p5.loadSound(
          songPath,
          () => {
            song.play();
          },
          () => {
            console.error(
              `Could not load the requested sound file ${songPath}`
            );
          }
        );
        return;
      }
      if (!song.isPlaying()) {
        song.play();
        return;
      } else {
        song.pause();
      }
    });

  };

  const draw = (p5) => {
    p5.background(100);
    p5.rectMode(p5.CENTER)
    p5.rect(width/2, height/2, 100, 100)
    p5.ellipse(x, y, 70, 70);
    x++;
    y++
  };

  return <Sketch 
    preload={preload} 
    setup={setup} 
    draw={draw} 
  />;
};