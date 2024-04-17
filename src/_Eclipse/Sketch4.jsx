import { useState } from 'react'
// import './Eclipse.scss'

const EmbedSketch = () => {
  
  const [isIframeReady, setIsIframeReady] = useState(false);

  const url = "https://openprocessing.org/sketch/2239445/embed/?plusEmbedHash=f328a82c&userID=421888&plusEmbedFullscreen=true&show=sketch"
  return (
    <div className='wrapper-iframe' >
        <iframe
          onLoad={() => {
            setTimeout(() => {
              setIsIframeReady(true)
            }, 500)
            
          }}
          src={url}
          width="660"
          height="660"
          title="Embedded Sketch"
          allowFullScreen
        ></iframe>

      {
        !isIframeReady && 
        <div className='iframe-loading'>
          {/* Loading... */}
        </div>
      }

    </div>
  );
};

export default EmbedSketch;
