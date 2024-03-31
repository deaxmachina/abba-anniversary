import './SpotifyMetricsViz.scss'
import { useMemo, useEffect, useState } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'
import audioFeatures from '../data/audio_features_results.json'


const degToRad = (deg) => {
  return deg * (Math.PI / 180)
}


const SpotifyMetricsViz = ({ width, height, colours, songId }) => {

  const [selectedMetric, setSelectedMetric] = useState(null)

  // Get the audio features for the selected song 
  const audioFeaturesSong = useMemo(() => {
    return audioFeatures.find(d => d.id === songId)
  }, [songId])

  useEffect(() => {
    console.log('songId', songId)
    console.log('audioFeaturesSong', audioFeaturesSong)
  }, [songId, audioFeaturesSong])

  // TODO: Need to use this in the end to compute the radii to make it responsive
  const maxRadius = useMemo(() => {
    return Math.floor(width / 2 - 70)
  }, [width])

  // Scale that maps metrics 0-1 to 0 to 360 degrees
  const numToDegScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, 360])
  // Scale that only maps the tempo from min to max tempo 
  const tempoToDegScale = d3.scaleLinear()
    .domain(d3.extent(audioFeatures, d => d.tempo))
    .range([0, 350])
  // Scale that only maps the loudness from min to max loudness 
  const loudnessToDegScale = d3.scaleLinear()
    .domain(d3.extent(audioFeatures, d => d.loudness))
    .range([360, 0])
  // Radius scale 
  const degToRadiusScale = d3.scaleSqrt()
    .domain([0, 360])
    .range([4, 25])

  // TODO: These will come from data 
  // const spotifyMetrics = [
  //   { metric: 'energy', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340]) },
  //   { metric: 'danceability', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  //   { metric: 'acounsticness', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  //   { metric: 'tempo', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  //   { metric: 'valence', angle: _.sample([0, 30, 50, 70, 150, 200, 220, 260, 300, 340])  },
  // ]

  const spotifyMetrics = ['tempo', 'loudness', 'energy', 'danceability', 'valence'].map(metric => {
    const rawValue = audioFeaturesSong[metric]
    const value = rawValue
    let angle = 0
    let fill = '#fff'
    if (['energy', 'danceability', 'valence'].includes(metric)) {
      angle = numToDegScale(rawValue)
      fill = colours.primary1
    } else if (metric === 'tempo') {
      angle = tempoToDegScale(rawValue)
      fill = colours.secondary1
    } else if (metric === 'loudness') {
      angle = loudnessToDegScale(rawValue)
      fill = colours.secondary1
    }
    return { metric, value, angle, fill }
  })


  return (
    <>
      <g transform={`translate(${width * 0.5}, ${height * 0.4})`} >
        <g className='spotify-metrics-g' style={{ filter: "url(#glow-subtle)" }}>
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
                    stroke={colours.goldLight}
                    strokeWidth='0.1'
                    fill='none'
                    style={{ pointerEvents: 'none' }}
                  ></circle>
                  {/* An arc from 0 to the circle? */}
                  <path 
                    className='path-to-metric-circle'
                    fill='none' 
                    // stroke={metric.fill}
                    stroke={colours.goldLight}
                    strokeWidth={2}
                    style={{ strokeLinejoin: 'round' }}
                    d={d3.arc()({
                      innerRadius: r,
                      outerRadius: r,
                      startAngle: 0,
                      endAngle: degToRad(metric.angle)
                    })}
                    opacity={selectedMetric === null || selectedMetric === metric.metric ? 1 : 0}
                  />
                  {/* Metric labels */}
                  <path 
                    fill='none'
                    stroke='none'
                    id={`${metric.metric}-path`}
                    d={d3.arc()({
                      innerRadius: r,
                      outerRadius: r,
                      startAngle: 0,
                      endAngle: Math.PI 
                    })}
                  />
                  <text 
                    className='spotify-metric-label' 
                    fill={colours.goldLight} 
                    dy='-0.2rem'
                    opacity={selectedMetric === null || selectedMetric === metric.metric ? 1 : 0}
                  >
                    <textPath xlinkHref={`#${metric.metric}-path`} startOffset='0%' style={{ textAnchor: 'start' }}>
                      {metric.metric}
                    </textPath>
                  </text>
                  {/* The circle on the orbit for that metric */}
                  <g 
                    transform={`translate(${Math.cos(degToRad(metric.angle-90)) * r}, ${Math.sin(degToRad(metric.angle-90)) * r})`}
                  >
                    <circle 
                      className='spotify-metrics'
                      onMouseOver={() => { 
                        setSelectedMetric(metric.metric) 
                      }}
                      onMouseOut={() => { setSelectedMetric(null) } }
                      cx={0}
                      cy={0}
                      r={degToRadiusScale(metric.angle)}
                      fill={metric.fill}
                      opacity={selectedMetric === null || selectedMetric === metric.metric ? 1 : 0}
                      //fill="url(#radial-gradient-planets)"
                    ></circle>
                    <text 
                      className='label-metric-val' 
                      x={0}
                      dy='0.35em' 
                      fill='#fff'
                      textAnchor='middle'
                      opacity={selectedMetric === metric.metric ? 1 : 0}
                    >
                      {metric.value.toFixed(2)}
                    </text>
                  </g>
                </g>
                )
              }
            )
          }
        </g>
      </g>
    </>
  )
}

export default SpotifyMetricsViz