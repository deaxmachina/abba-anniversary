import { useState, useEffect, Suspense } from 'react'
import _ from 'lodash'
import './App.scss'
import Albums3DScene from './Albums3DScene/Albums3DScene'
import SongsViz from './SongsViz/SongsViz';
import Loading from './Loading/Loading';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import { coloursDefault } from './assets/colours'

function App() {
  const [colours, setColours] = useState(coloursDefault)
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


  return (
    <div className='overall-wrapper'>
      <ThemeSelector setColours={setColours} />
      <div className='wrapper-3d'>
      <Suspense fallback={<Loading />}>
        <Albums3DScene
            selectedAlbumId={selectedAlbumId}
            setSelectedAlbumId={setSelectedAlbumId}
            showHtml={showHtml}
            setShowHtml={setShowHtml}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            colours={colours}
          />
      </Suspense>
      </div>

      {
        showHtml && selectedAlbumId && 
        <div className='wrapper-2d'>
          <SongsViz selectedAlbumId={selectedAlbumId} colours={colours} />
        </div>
      }
    </div>
  )
}

export default App
