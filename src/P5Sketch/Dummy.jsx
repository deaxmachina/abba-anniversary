

const Dummy = () => {

  const [songModeActive, setSongModeActive] = useState(false)

  // For the dummy gooey circles 
  const randomCircles = useMemo(() => {
      return  _.range(40).map(i => {
        // Top edge 
        const xTop = Math.random() * width 
        const yTop = _.random(0, 0.15) * height
        // Bottom edge 
        const xBottom = Math.random() * width 
        const yBottom = _.random(0.85, 1.1) * height
        // Left edge 
        const xLeft = _.random(0.85, 1) * width
        const yLeft = Math.random() * height
        // Right edge 
        const xRight = _.random(0, 0.15) * width
        const yRight = Math.random() * height
        // All the options 
        const options = [
          // { x: xTop, y: yTop },
          { x: xBottom, y: yBottom },
          // { x: xLeft, y: yLeft },
          // { x: xRight, y: yRight }
        ]
        const option = _.sample(options)
        const x = option.x
        const y = option.y
        const r = Math.round(_.random(20, 80))
        const fill = _.sample([colours.primary1, colours.secondary1, '#adb3c2'])
        const fillOpacity = _.random(0.2, 0.6)
        return { x, y, r, fill, fillOpacity }
      })
  }, [width, height, colours])
        // // Button to set song to null 
        // buttonExitSongs = p.select('.exit-songs-btn')
        // buttonExitSongs.addClass('hide')
        // buttonExitSongs.removeClass('show')
        // buttonExitSongs.mousePressed(() => {
        //   if (songRef.current) songRef.current.pause()
        //   songRef.current = songUrl = songId = audioFeaturesSong = clickedNodeId = songName = songNameOnHover = null
        //   setSongModeActive(false)

        // nodesSimulation.forEach(node => {
        //   if (p.dist(p.mouseX, p.mouseY, node.x, node.y) <= node.size/2) {
        //     songId = node.id
        //     clickedNodeId = node.id
        //     songName = node.name
        //     songUrl = audioPreviews.find(d => d.song_id === node.id).song_audioPreview.url
        //     if (songRef.current) songRef.current.pause() // pause the previous song first
        //     setSongModeActive(true)

  return (
    <svg 
      className='svg-gooey-blobs' 
      filter='url(#gooeyCodeFilter)'
    >
      <defs>
        <filter id='gooeyCodeFilter'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='10' colorInterpolationFilters='sRGB' result='blur'/>
          <feColorMatrix className="blurValues" in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='gooey' />
          <feComposite in='SourceGraphic' in2='gooey' operator='atop' />
        </filter>
      </defs>
      {
        !songModeActive && randomCircles.map((d, i) => {
          return (
            <circle 
              key={d.x}
              className='decorative-blob'
              cx={d.x} 
              cy={d.y} 
              r={d.r} 
              fill={d.fill}
              fillOpacity={d.fillOpacity}
              // style={{ mixBlendMode: 'screen' }} 
            />
          )
        })
      }
    </svg>
  )
}