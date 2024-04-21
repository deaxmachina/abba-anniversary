import { useState } from 'react'
import './ThemeSelector.scss'
import { coloursDefault, coloursOption2, coloursOption3, coloursOption4, coloursOption5 } from '../assets/colours'
import Icon from './Icon'

const themeOptions = [
  {
    theme: 'theme1',
    colours: coloursDefault
  },
  {
    theme: 'theme2',
    colours: coloursOption2
  },
  {
    theme: 'theme3',
    colours: coloursOption3
  },
  {
    theme: 'theme4',
    colours: coloursOption4
  },
  // {
  //   theme: 'theme5',
  //   colours: coloursOption5
  // },
]

const ThemeSelector = ({ setColours }) => {
  const [transform, setTransform] = useState('translate(300px, 0)')
  const [activeTheme, setActiveTheme] = useState('theme1')
  const [hoveredTheme, setHoveredTheme] = useState('')

  return (
    <div 
      className='wrapper-theme-selector' 
      // style={{ transform: transform }}
      // onMouseOver={() => { setTransform('translate(50px, 0)') }}
      // onMouseOut={() => { setTransform('translate(300px, 0)') }}
    >

      {/* <div className='select-theme-label'>
        <Icon />
      </div> */}

      <div className='select-theme-options'>
        <div className='wrapper-theme-btns'>

          {
            themeOptions.map(themeOption => (
              <button 
                className='theme-btn' 
                onClick={() => { 
                  setColours(themeOption.colours) 
                  setActiveTheme(themeOption.theme)
                }}
                onMouseOver={() => {
                  setHoveredTheme(themeOption.theme)
                }}
                onMouseOut={() => {
                  setHoveredTheme('')
                }}
                style={{ filter: activeTheme === themeOption.theme || hoveredTheme === themeOption.theme 
                  ? 'grayscale(0%)' : 'grayscale(100%)' }}
                >
                <img className='theme-thumbnail' src={`/theme_thumbnails/${themeOption.theme}_thumb.png`} />
              </button>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default ThemeSelector