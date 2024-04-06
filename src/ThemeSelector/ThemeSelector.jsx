import './ThemeSelector.scss'
import { coloursDefault, coloursOption2, coloursOption3, coloursOption4, coloursOption5 } from '../assets/colours'

const ThemeSelector = ({ setColours }) => {

  return (
    <div className='wrapper-theme-selector'>
      Select your theme
      <div className='wrapper-theme-btns'>
        <button className='theme-btn' onClick={() => { setColours(coloursDefault) }}>
          <img className='theme-thumbnail' src='/theme_thumbnails/theme1_thumb.png' />
        </button>
        <button className='theme-btn' onClick={() => { setColours(coloursOption2) }}>
          <img className='theme-thumbnail' src='/theme_thumbnails/theme2_thumb.png' />
        </button>
        <button className='theme-btn' onClick={() => { setColours(coloursOption3) }}>
          <img className='theme-thumbnail' src='/theme_thumbnails/theme3_thumb.png' />
        </button>
        <button className='theme-btn' onClick={() => { setColours(coloursOption4) }}>
          <img className='theme-thumbnail' src='/theme_thumbnails/theme4_thumb.png' />
        </button>
        <button className='theme-btn' onClick={() => { setColours(coloursOption5) }}>
          <img className='theme-thumbnail' src='/theme_thumbnails/theme5_thumb.png' />
        </button>
      </div>
    </div>
  )
}

export default ThemeSelector