
const Filters = () => {

  return (
    <>
      <filter id='glow'>
        <feGaussianBlur stdDeviation='10' result='coloredBlur' />
        <feMerge>
          <feMergeNode in='coloredBlur' />
          <feMergeNode in='SourceGraphic' />
        </feMerge>
      </filter>

      <filter id='glow-subtle'>
        <feGaussianBlur stdDeviation='3' result='coloredBlur' />
        <feMerge>
          <feMergeNode in='coloredBlur' />
          <feMergeNode in='SourceGraphic' />
        </feMerge>
      </filter>

      <radialGradient id='radial-gradient' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stopColor='#FFF76B'></stop>
        <stop offset='50%' stopColor='#FFF845'></stop>
        <stop offset='90%' stopColor='#FFDA4E'></stop>
        <stop offset='100%' stopColor='#FB8933'></stop>
      </radialGradient>
            
      <radialGradient id='radial-gradient-planets' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stopColor='#3a86ff'></stop>
        <stop offset='100%' stopColor='#8338ec'></stop>
      </radialGradient>   
    </>
  )
}

export default Filters