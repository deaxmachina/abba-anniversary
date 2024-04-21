import './Credits.scss'
import { useState } from 'react'

const Credits = () => {

  const [transform, setTransform] = useState('translate(330px, 0)')

  return (
    <div 
      className='wrapper-credits'
      style={{ transform: transform }}
      onClick={() => {
        setTransform(t => t === 'translate(330px, 0)' ? 'translate(0px, 0)' : 'translate(330px, 0)')
      }}
    >
      <div className='pullout'>
        credits <div className='star'>★</div>
      </div>
      <div className='content'>
        This will be the content
      </div>
    </div>
  )
}

export default Credits