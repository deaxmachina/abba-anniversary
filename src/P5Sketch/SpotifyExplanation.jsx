import './P5Sketch.scss'


const SpotifyExplanation = () => {

  return (
    <div className='graph-explanation'>
      <p className='intro'>
        The size of the visible part of each
        <div className='sun'>sun</div> corresponds to a <a 
          href='https://developer.spotify.com/documentation/web-api/reference/get-audio-features'
          target='_blank'
        >
          Spotify audio feature
        </a>:
      </p>

      <p>
        <span className='metric-name'>valence</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>        
          How positve (higher) or noody (lower) the song sounds. 
        </span>    
      </p>
      <p>
        <span className='metric-name'>loudness</span>
        <span className='metric-range'>-60 to 0 dB</span>
        <span className='metric-explanation'>Loudness of the song in decibels (dB)</span> 
      </p>
      <p>
        <span className='metric-name'>tempo</span>
        <span className='metric-range'>~100-200bpm</span>
        <span className='metric-explanation'>Spotify-estimated tempo in beats per minute (BPM).</span> 
      </p>
      <p>
        <span className='metric-name'>energy</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>How intense / noisy / high entropy the song is perceived to be.</span> 
      </p>
      <p>
        <span className='metric-name'>danceability</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>How suited the song is for dancing (supposedly...)</span> 
      </p>
    </div>
  )
}

export default SpotifyExplanation