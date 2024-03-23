import { useState } from 'react'
import './App.scss'
import Albums3DScene from './Albums3DScene/Albums3DScene'
import useMountTransition from "./useMountTransition";
import SongsViz from './SongsViz/SongsViz';

function App() {
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [showHtml, setShowHtml] = useState(false)

  const hasTransitionedIn = useMountTransition(showHtml, 2000);

  return (
    <div className='overall-wrapper'>
      <div className='wrapper-3d'>
        <Albums3DScene
          selectedAlbumId={selectedAlbumId}
          setSelectedAlbumId={setSelectedAlbumId}
          showHtml={showHtml}
          setShowHtml={setShowHtml}
        />
      </div>
      {
        (hasTransitionedIn || showHtml) &&
        <div className={`wrapper-2d ${hasTransitionedIn && "in"} ${showHtml && "visible"}`}>
          <SongsViz selectedAlbumId={selectedAlbumId} />
        </div>
      }
    </div>
  )
}

export default App
