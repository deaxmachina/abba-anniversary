import './SpotifyMetricsViz.scss'
import { useMemo } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'

// TODO: These will come from data 
const spotifyMetrics = [
  { metric: 'energy', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340]) },
  { metric: 'danceability', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  { metric: 'acounsticness', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  { metric: 'tempo', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  { metric: 'valence', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
]

const radtoDeg = (deg) => {
  return deg * (Math.PI / 180)
}

const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(100)
  .startAngle(0)
  .endAngle(Math.PI / 2)

const SpotifyMetricsViz = ({ width, height }) => {

  const maxRadius = useMemo(() => {
    return Math.floor(width / 2 - 70)
  }, [width])


  return (
    <>
      <g transform={`translate(${width * 0.5}, ${height * 0.4})`} >
        <g className='spotify-metrics-g'>
          {
            spotifyMetrics.map((metric, i) => {
              const r = 70 + i*30
              return (
                <g key={metric.metric}>
                  {/* The orbit */}
                  <circle 
                    className='spotify-metrics'
                    cx={0}
                    cy={0}
                    r={r}
                    stroke='#fcedbb'
                    strokeWidth='0.3'
                    fill='none'
                  ></circle>
                  {/* An arc from 0 to the circle? */}
                  <path 
                    fill='none'
                    stroke='#fcedbb'
                    strokeWidth={3}
                    style={{ strokeLinejoin: 'round' }}
                    d={d3.arc()({
                      innerRadius: r,
                      outerRadius: r,
                      startAngle: 0,
                      endAngle: radtoDeg(metric.angle)
                    })}
                  />
                  {/* The circle on the orbit for that metric */}
                  <g style={{ filter: "url(#glow-subtle)" }}>
                    <circle 
                      className='spotify-metrics'
                      cx={Math.cos(radtoDeg(metric.angle-90)) * r}
                      cy={Math.sin(radtoDeg(metric.angle-90)) * r}
                      r={Math.max(10, metric.angle * 0.08)}
                      fill='#af2f91'
                      //fill="url(#radial-gradient-planets)"
                    ></circle>
                  </g>
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