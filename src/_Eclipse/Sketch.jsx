import p5 from "p5";
import { ReactP5Wrapper } from "@p5-wrapper/react";

window.p5 = p5;

import("p5/lib/addons/p5.sound.js");

function sketch(p5, width, height, audioUrl) {
  let song
  let button

  p5.setup = () => {
    p5.createCanvas(600, 600)
    button = p5.createButton("Toggle audio")
    button.mousePressed(() => {
      if (!song) {
        const songPath = './08GOw3NsrJ0LsCCeyqzt3b_1e59216e9b6f62bf73e198dbd1550cf36d635ca9.mp3'
        song = p5.loadSound(
          songPath,
          () => {
            console.log('song playing')
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
      }

      song.pause();
    });

  }

  p5.draw = () => {
    p5.background(250);
    // p5.normalMaterial();
    // p5.push();
    // p5.rotateZ(p5.frameCount * 0.01);
    // p5.rotateX(p5.frameCount * 0.01);
    // p5.rotateY(p5.frameCount * 0.01);
    // p5.plane(100);
    // p5.pop();
  };
}

const Sketch = ({ width, height, audioUrl }) => {
  // return <ReactP5Wrapper sketch={(_) => sketch(_, width, height, audioUrl)}/>
  return <ReactP5Wrapper sketch={(_) => sketch(_,width, height, audioUrl)}/>
}

export default Sketch