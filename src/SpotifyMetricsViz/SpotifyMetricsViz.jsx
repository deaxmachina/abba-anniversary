import './SpotifyMetricsViz.scss'
import { useMemo } from 'react'
import _ from 'lodash'

// TODO: These will come from data 
const spotifyMetrics = ['energy', 'danceability', 'acounsticness', 'tempo', 'valence']

const radtoDeg = (deg) => {
  return deg * (Math.PI / 180)
}

const SpotifyMetricsViz = ({ width, height }) => {

  const maxRadius = useMemo(() => {
    return Math.floor(width / 2 - 70)
  }, [width])


  return (
    <>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <g className='spotify-metrics-g'>
          {
            spotifyMetrics.map((metric, i) => {
              const r = 70 + i*40
              const angle = _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])
              return (
                <g key={metric}>
                  {/* The orbit */}
                  <circle 
                    className='spotify-metrics'
                    cx={0}
                    cy={0}
                    r={r}
                    stroke='#ebebeb'
                    strokeWidth='1'
                    strokeDasharray='6 4'
                    fill='none'
                  ></circle>
                  {/* The circle on the orbit for that metric */}
                  <circle 
                    className='spotify-metrics'
                    cx={Math.cos(radtoDeg(angle)) * r}
                    cy={Math.sin(radtoDeg(angle)) * r}
                    r={Math.max(10, angle * 0.08)}
                    fill='pink'
                  ></circle>
                </g>
                )
              }
            )
          }
          {/* <circle
            className='spotify-metrics'
            cx={0}
            cy={0}
            r={100}
            stroke='pink'
            strokeWidth='10'
            fill='none'
          ></circle> */}
        </g>
      </g>
    </>
  )
}

export default SpotifyMetricsViz