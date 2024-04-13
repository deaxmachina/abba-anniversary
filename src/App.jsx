import { useState, useEffect, Suspense } from 'react'
import _ from 'lodash'
import { getGPUTier } from 'detect-gpu';
import './App.scss'
import Albums3DScene from './Albums3DScene/Albums3DScene'
import SongsViz from './SongsViz/SongsViz';
import Loading from './Loading/Loading';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import { coloursDefault } from './assets/colours'
import NotWorkingScreen from './NotWorkingScreen/NotWorkingScreen';

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

  // The dimensions below which we don't show the app
  const widthCondition = windowWidth <= 1150
  const heightCondition = windowHeight <= 700

  // GPU conditions 
  const [gpuTier, setGpuTier] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getGPUTier();
      setGpuTier(data.tier)
    }
    fetchData()
  }, [])
  // gpuTier >= 3 ? 300 : gpuTier >=2 ? 100 : 50

  // Browser conditions
  const [safari, setSafari] = useState(false)
  useEffect(() => {
    const userAgentString = window.navigator.userAgent
    // Detect Chrome 
    const chromeAgent = userAgentString.indexOf("Chrome") > -1; 
    // Detect Safari 
    let safariAgent = userAgentString.indexOf("Safari") > -1; 
    // Discard Safari since it also matches Chrome 
    if ((chromeAgent) && (safariAgent)) safariAgent = false; 
    setSafari(safariAgent)
  }, [])



  return (
    <div className='overall-wrapper'>

      {
        (widthCondition || heightCondition) || (safari) ? 
        <NotWorkingScreen
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          widthCondition={widthCondition}
          heightCondition={heightCondition}
          safari={safari}
        /> :
        <>
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
        </>
      }

    </div>
  )
}

export default App
