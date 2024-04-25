import './P5Sketch.scss'

const metricDefinitions = [
  {
    metric: 'valence',
    metricBg: 'валентност',
    range: '0.0 - 1.0',
    defEn: 'How cheerful (closer to 1) or moody (closer to 0) the song sounds.',
    defBg: 'Колко радостно / позитивно (по-близо до 1), или тъжно / унило (по-близо до 0) звучи песента.'
  },
  {
    metric: 'loudness',
    metricBg: 'гръмкост',
    range: '-60dB - 0dB',
    defEn: 'How loud the song is, in decibels (dB).',
    defBg: 'Колко е шумна песента, в децибели.'
  },
  {
    metric: 'tempo',
    metricBg: 'темпо',
    range: '~100-200bpm',
    defEn: 'Spotify-estimated tempo in beats per minute (BPM).',
    defBg: 'Темпото на песента в удари в минута (bpm), приблизително изчислено от Спотифай.'
  },
  {
    metric: 'energy', 
    metricBg: 'енергия',
    range: '0.0 - 1.0',
    defEn: 'How intense / noisy / high-entropy the song is perceived to be.',
    defBg: 'Колко шумна / интензивна / хаотична / енергична се усеща песента.'
  },
  {
    metric: 'danceability',
    metricBg: 'танцуваемост',
    range: '0.0 - 1.0',
    defEn: 'How suited the song is for dancing (supposedly...)',
    defBg: 'Колко става песента за танцуване (спорно...)'
  }
]


const SpotifyExplanation = ({ mum }) => {

  return (
    <div className='graph-explanation'>
      <p className='intro'>
        {
          mum ? 
          <>
            Размерът на видимата част на всяко 
            <div className='sun bg'>слънце</div> отговаря на 
            <br></br>
            <a 
              href='https://developer.spotify.com/documentation/web-api/reference/get-audio-features'
              target='_blank'
              class='a-audio-feature'
            >Spotify audio feature</a>
          </> 
          : 
          <>
            The size of the visible part of each
            <div className='sun'>sun</div> corresponds to one of the following <a 
              href='https://developer.spotify.com/documentation/web-api/reference/get-audio-features'
              target='_blank'
            >
              Spotify audio features
            </a>
          </>
        }
      </p>

      {
        metricDefinitions.map(metric => (
          <p key={metric.metric}>
            <span className='metric-name'>
              {metric.metric}
              { mum && <span className='metric-name-bg'>({metric.metricBg})</span> }
            </span>
            <span className='metric-range'>{metric.range}</span>
            <span className='metric-explanation'>{mum ? metric.defBg : metric.defEn}</span>    
          </p>
        ))
      }

    </div>
  )
}

export default SpotifyExplanation