import './Eclipse.scss'
import { useMemo, useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'
import audioFeatures from '../data/audio_features_results.json'
import { Sketch } from './Sketch'
import Sketch1 from './Sketch1'


const Eclipse = ({ width, height, colours, songId, audioUrl, setClickedNode }) => {

  const [show, setShow] = useState(false)
  const wrapperRef = useRef()

  // Get the audio features for the selected song 
  const audioFeaturesSong = useMemo(() => {
    return audioFeatures.find(d => d.id === songId)
  }, [songId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true)
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, []); 

  return (
    <div 
      className='wrapper-eclipse' 
      ref={wrapperRef}
      style={{ width: `${width-20}px`, height: `${height-20}px`, opacity: `${show ? 1 : 0}` }}
      onClick={() => { setClickedNode(null) }}
    >
      {/* <Sketch width={width-20} height={height-20} audioUrl={audioUrl} /> */}
      <Sketch1 canvasParentRef={wrapperRef} audioUrl={audioUrl} width={width-20} height={height-20} />
    </div>
  )
}

export default Eclipse