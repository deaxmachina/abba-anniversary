import './Credits.scss'
import { useState } from 'react'

const Credits = ({ fullSongPreview }) => {

  const [transform, setTransform] = useState('translate(450px, 0)')

  return (
    <div 
      className='wrapper-credits'
      style={{ transform: transform }}
      onClick={() => {
        setTransform(t => t === 'translate(450px, 0)' ? 'translate(0px, 0)' : 'translate(450px, 0)')
      }}
    >
      <div className='pullout'>
        about <div className='star'>★</div>
      </div>
      <div className='content'>

        <div className='about section'>
          <h3>About</h3>
          <p>
            I made this website as a birthday gift to my wonderful mum, but it also happens to coincide 
            with the commemoration of the 50th anniversary of ABBA's iconic Eurovision win in 1974. 
            <br></br>
            Browse through the band’s 9 studio albums, whose songs are represented as a ‘musical constellation’, 
            and visualised though a data art interpretation of musical features and Spotify metrics (energy, danceability, valence, loudness, tempo). 
            The celestial theme reflects on Abba’s journey and the ‘voyage’ theme of their latest album release in 2021. 
            Pro tip: browse through the songs alongside someone and see how much you agree with the values of the 
            Spotify metrics. I find that danceability tends to be particularly contentions.
          </p>
        </div>

        <div className='disclaimer section'>
          <h3>Disclaimer</h3>
          <p>
            Certain content on this website, such as audio and image materials associated with ABBA, 
            is the intellectual property of Polar Music International AB (*). 
            I hereby declare that I do not possess any ownership rights to said materials. 
            This website is an unofficial tribute, created exclusively for non-commercial, 
            entertainment purposes, and I do not claim any official 
            association with ABBA or Polar Music International AB. 
          </p>
          <p className='copyright'>
            (*) © 2001 Polar Music International AB; 
            <br></br>
            © 2021 1221 AB, under exclusive license to Polar Music International AB
          </p>
        </div>

        <div className='credits section'>
          <h3>Credits</h3>
          <p>
            Music previews and music audio features data was obtained via <a href='https://developer.spotify.com/documentation/web-api' target='_blank'>
            the Spotify Web API</a>. {
              !fullSongPreview &&
              <>
                The API provides 30s music clip previews, but these were clipped to 15s to avoid copyright issues. 
                If you have a Spotify account, head to the link provided for the full song.
              </>}
            <br></br>
            Environment maps were AI-generated via <a href='https://skybox.blockadelabs.com/' target='_blank'>Skybox AI by Blockade Labs</a>
            <br></br> 
            The Three.js code for the photo gallery is based on <a href='https://codesandbox.io/p/sandbox/image-gallery-lx2h8?file=%2Fsrc%2FApp.js'>this example</a> by  <a href='https://docs.pmnd.rs/react-three-fiber/getting-started/examples'>Pmndrs</a>
          </p>
        </div>

        <div className='tech section'>
          <h3>Tech</h3>
          <p>
            Made with 
            React, Three.js + React Three Fiber + Drei, p5.js + p5 sound 
          </p>
        </div>

        <div className='byline section'>
          <p>
            Made with 💖 by <a href='https://deabankova.com/' target='_blank'>Dea Bankova</a> in April 2024.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Credits