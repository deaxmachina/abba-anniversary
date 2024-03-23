import albums from "./data/albums.json"
import albumsFor3D from '../Albums3DScene/albums'

console.log('albums', albums)

const SongsViz = ({ selectedAlbumId }) => {

  return (
    <>
      <div className="wrapper-viz" 
        // style={{ background: `${albumsFor3D.filter(d => d.id === selectedAlbumId)[0].colorDark}cc` }}
      >
          <button>Click meeee </button>
          {selectedAlbumId}
          <div>
            { 
              albums.filter(d => d.id === selectedAlbumId)[0].tracks.map(track => (
                <>
                  <h4>{track.name}</h4>
                </>
              ))
            }
          </div>
      </div>
    </>
  )
}

export default SongsViz