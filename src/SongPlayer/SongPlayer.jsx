import { useState, useRef, useEffect } from 'react';

import './SongPlayer.scss'

const SongPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const audioRef = useRef(null)
  useEffect(() => {
    if (audioRef) {
      // Reduce the default volume 
      audioRef.current.volume = 0.3
      // audioRef.current.muted = isPlaying
      // Control the play and pause behaviour with state
      if (!isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }, [audioRef, audioUrl, isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className='wrapper-audio-player'>
      {/* <button onClick={fetchAudio}>Fetch Song</button> */}
        <div>
          <audio src={audioUrl} controls={true} autoPlay={true} ref={audioRef} />
          <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    </div>
  );
}

export default SongPlayer;
