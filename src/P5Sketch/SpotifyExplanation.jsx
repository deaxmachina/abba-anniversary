import './P5Sketch.scss'


const SpotifyExplanation = () => {

  return (
    <div className='graph-explanation'>
      <p className='intro'>
        The size of the visible part of each
        <div className='sun'>sun</div> corresponds to a Spotify audio feature: 
      </p>

      <p>
        <span className='metric-name'>valence</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>        
          Describes how positve-sounding the song is. Higher numbers correspond to happier, more cheerful songs; lower numbers to moodier ones. 
        </span>    
      </p>
      <p>
        <span className='metric-name'>loudness</span>
        <span className='metric-range'>-60 to 0 dB</span>
        <span className='metric-explanation'>The loudness of the song in decibels (dB)</span> 
      </p>
      <p>
        <span className='metric-name'>tempo</span>
        <span className='metric-range'>~100-200bpm</span>
        <span className='metric-explanation'>The Spotify estimated tempo of the song in beats per minute (BPM).</span> 
      </p>
      <p>
        <span className='metric-name'>energy</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>How intense / noisy / high entropy is the song perceived to be.</span> 
      </p>
      <p>
        <span className='metric-name'>danceability</span>
        <span className='metric-range'>0.0 to 1.0.</span>
        <span className='metric-explanation'>How suited the song is for dancing (very subjective though...)</span> 
      </p>
      <a 
        href='https://developer.spotify.com/documentation/web-api/reference/get-audio-features'
        target='_blank'
      >
        Read more from Spotify
      </a>
    </div>
  )
}

export default SpotifyExplanation