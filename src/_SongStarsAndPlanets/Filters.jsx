
const Filters = () => {

  return (
    <>
      <filter id='glow-extreme'>
        <feGaussianBlur stdDeviation='20' result='coloredBlur' />
        <feMerge>
          <feMergeNode in='coloredBlur' />
          <feMergeNode in='SourceGraphic' />
        </feMerge>
      </filter>

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

      {/* Blur off the blobs behind the stars */}
      <filter id='blob-blur' width='200%' height='200%' x='-60%' y='-60%' colorInterpolationFilters='sRGB' >
        <feGaussianBlur in='SourceGraphic' stdDeviation='7' />
      </filter>


      {/* Gooey effect */}
      <filter id='gooeyCodeFilter'>
        <feGaussianBlur in='SourceGraphic' stdDeviation='10' colorInterpolationFilters='sRGB' result='blur'/>
        <feColorMatrix className="blurValues" in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='gooey' />
        <feComposite in='SourceGraphic' in2='gooey' operator='atop' />
      </filter>


      <radialGradient id='radial-gradient' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stopColor='#fcedbb'></stop>
        <stop offset='70%' stopColor='#ea9918'></stop>
        <stop offset='90%' stopColor='#ea9918'></stop>
        <stop offset='100%' stopColor='#b38a42'></stop>
      </radialGradient>
            
      <radialGradient id='radial-gradient-planets' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stopColor='#3a86ff'></stop>
        <stop offset='100%' stopColor='#8338ec'></stop>
      </radialGradient>   
    </>
  )
}

export default Filters