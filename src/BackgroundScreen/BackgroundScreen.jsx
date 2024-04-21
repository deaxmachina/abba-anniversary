import './BackgroundScreen.scss'
import gsap from 'gsap'
import { useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import _ from 'lodash'

const BackgroundScreen = ({ childrenComponent, windowWidth, windowHeight, showBlobs=true }) => {

  const wrapperRef = useRef()
  const ctx = useRef()
  const timeline = useRef()

  useLayoutEffect(() => {
    if (!showBlobs) return 
    ctx.current = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: false })
        .fromTo('.decorative-circle', {
          attr: {
            'fill-opacity': 0,
            'cx': (i) => dummyDataLeft[i].x,
            'cy': (i) => dummyDataLeft[i].y,
          },
        }, {
          attr: {
            'fill-opacity': (i) => dummyDataLeft[i].fillOpacity,
            'cx': (i) => {
              if (Math.random() < 0.5) {
                return dummyDataLeft[i].x + _.random(20, 100)
              } else {
                return dummyDataLeft[i].x 
              }
            },
            'cy': (i) => {
              if (Math.random() < 0.5) {
                return dummyDataLeft[i].y + _.random(20, 100)
              } else {
                return dummyDataLeft[i].y 
              }
            },
          },
          repeat: -1,
          duration: 1.5,
          stagger: 0.1,
          yoyo: true
        })
        .fromTo('.decorative-circle', {
          attr: {
            'r': 0,
          },
        }, {
          attr: {
            'r': (i) => dummyDataLeft[i].r
          },
          repeat: -1,
          duration: 0.5,
          stagger: 0.1,
          yoyo: true
        }, '<')
        // Right circles
        .fromTo('.decorative-circle-right', {
          attr: {
            'fill-opacity': 0,
            'cx': (i) => dummyDataRight[i].x,
            'cy': (i) => dummyDataRight[i].y,
          },
        }, {
          attr: {
            'fill-opacity': (i) => dummyDataRight[i].fillOpacity,
            'cx': (i) => {
              if (Math.random() < 0.5) {
                return dummyDataRight[i].x + _.random(20, 100)
              } else {
                return dummyDataRight[i].x 
              }
            },
            'cy': (i) => {
              if (Math.random() < 0.5) {
                return dummyDataRight[i].y + _.random(20, 100)
              } else {
                return dummyDataRight[i].y 
              }
            },
          },
          repeat: -1,
          duration: 1.5,
          stagger: 0.1,
          yoyo: true
        }, '<')
        // Right circles 
        .fromTo('.decorative-circle-right', {
          attr: {
            'r': 0,
          },
        }, {
          attr: {
            'r': (i) => dummyDataRight[i].r
          },
          repeat: -1,
          duration: 0.5,
          stagger: 0.1,
          yoyo: true
        }, '<')
    }, wrapperRef)

    return () => ctx.current.revert()
  }, [])


  const dummyDataLeft = useMemo(() => {
    return  _.range(40).map(i => {
      const x = _.random(0, 0.5)*windowWidth // _.random(-0.05, 0.15)*windowWidth
      const y = Math.random()*windowHeight
      const r = Math.round(_.random(50, 170))
      const fill = _.sample(['#4b0af5', '#c929f7', '#ea9918', '#adb3c2'])
      const fillOpacity = _.random(0.2, 0.6)
      return { x, y, r, fill, fillOpacity }
    })
  }, [windowWidth, windowHeight])
  const dummyDataRight = useMemo(() => {
    return  _.range(40).map(i => {
      const x = _.random(0.5, 1)*windowWidth // _.random(0.85, 1)*windowWidth
      const y = Math.random()*windowHeight
      const r = Math.round(_.random(50, 170)) // Math.round(_.random(10, 50))
      const fill = _.sample(['#4b0af5', '#c929f7', '#ea9918', '#adb3c2'])
      const fillOpacity = _.random(0.2, 0.6) // _.random(0.1, 0.5)
      return { x, y, r, fill, fillOpacity }
    })
  }, [windowWidth, windowHeight])

  return (
    <div className='wrapper-bacgkround-screen' ref={wrapperRef}>
      <div className="video-background">
        <video autoPlay muted loop id="myVideo">
          <source src="./mammamia2.mp4" type="video/mp4" ></source>
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="ryoo-bg5"></div>
      {childrenComponent}

      { 
       showBlobs && 
        <div className='decorative'>
          <svg filter='url(#gooeyCodeFilter)'>
            <defs>
            <filter id='glow-extreme'>
              <feGaussianBlur stdDeviation='20' result='coloredBlur' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
            <filter id='gooeyCodeFilter'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='10' colorInterpolationFilters='sRGB' result='blur'/>
              <feColorMatrix className="blurValues" in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='gooey' />
              <feComposite in='SourceGraphic' in2='gooey' operator='atop' />
            </filter>
            </defs>
          {
            dummyDataLeft.map((d, i) => {
              return (
                <circle 
                  key={d.x}
                  className='decorative-circle'
                  cx={d.x} 
                  cy={d.y} 
                  r={d.r} 
                  fill={d.fill}
                  fillOpacity={d.fillOpacity}
                  style={{ mixBlendMode: 'screen' }} 
                />
              )
            })
          }
          {
            dummyDataRight.map(d => {
              return (
                <circle 
                  className='decorative-circle-right'
                  key={d.x}
                  cx={d.x} 
                  cy={d.y} 
                  r={d.r} 
                  fill={d.fill}
                  fillOpacity={d.fillOpacity}
                  style={{ mixBlendMode: 'screen' }}
                />
              )
            })
          }
          </svg>
        </div>
      }

    </div>
  )
}

export default BackgroundScreen