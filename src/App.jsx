import { useState } from 'react'
import './App.scss'
import SceneWorking from './SceneWorking'
import useMountTransition from "./useMountTransition";
// import SceneTest from './SceneTest'

// Don't bother with Html element just use a regular html

function App() {
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [showHtml, setShowHtml] = useState(false)

  const hasTransitionedIn = useMountTransition(showHtml, 2000);

  return (
    <div className='overall-wrapper'>
      <div className='wrapper-3d'>
        <SceneWorking
          selectedAlbumId={selectedAlbumId}
          setSelectedAlbumId={setSelectedAlbumId}
          showHtml={showHtml}
          setShowHtml={setShowHtml}
        />
      </div>
      {
        (hasTransitionedIn || showHtml) &&
        <div className={`wrapper-2d ${hasTransitionedIn && "in"} ${showHtml && "visible"}`}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
          when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
          It has survived not only five centuries, but also the leap into electronic 
          typesetting, remaining essentially unchanged. It was popularised in the 
          1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
          and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          <button>Click meeee </button>
          {selectedAlbumId}
        </div>
      }
    </div>
    // <SceneWorking />
  )
}

export default App
