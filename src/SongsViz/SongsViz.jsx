import albums from "./data/albums.json"

console.log('albums', albums)

const SongsViz = ({ selectedAlbumId }) => {

  return (
    <>
      <div>
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