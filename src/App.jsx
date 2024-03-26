import { useState, useEffect } from 'react'
import _ from 'lodash'
import './App.scss'
import Albums3DScene from './Albums3DScene/Albums3DScene'
import useMountTransition from "./useMountTransition";
import SongsViz from './SongsViz/SongsViz';

function App() {
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [showHtml, setShowHtml] = useState(false)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    const throttledResize = _.throttle(() => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }, 300);
    window.addEventListener('resize', () => { 
      throttledResize() 
      // setWindowWidth(window.innerWidth)
      // setWindowHeight(window.innerHeight)
    })
  }, [])

  const hasTransitionedIn = useMountTransition(showHtml, 2000);

  return (
    <div className='overall-wrapper'>
      <div className='wrapper-3d'>
        <Albums3DScene
          selectedAlbumId={selectedAlbumId}
          setSelectedAlbumId={setSelectedAlbumId}
          showHtml={showHtml}
          setShowHtml={setShowHtml}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />
      </div>
      {
        showHtml && selectedAlbumId && 
        <div className='wrapper-2d'>
          <SongsViz selectedAlbumId={selectedAlbumId} />
        </div>
      }
      {/* {
        (hasTransitionedIn || showHtml) &&
        <div className={`wrapper-2d ${hasTransitionedIn && "in"} ${showHtml && "visible"}`}>
          {
           showHtml && 
           <SongsViz selectedAlbumId={selectedAlbumId} />
          }
        </div>
      } */}
    </div>
  )
}

export default App
