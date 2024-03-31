
// const colours = {
//   goldSaturated: '#ea9918',
//   goldDark: '#b38a42',
//   goldMid: '#eeb064',
//   goldLight: '#fcedbb', 
//   primary1: '#8338ec', 
//   primary1accent: '',
//   secondary1: '#af2f91',
//   secondary1accent: '',
// }
// colours.textAbba = colours.goldDark
// colours.textTitle = colours.primary1

// colours.pointLight1 = colours.primary1
// colours.pointLight2 = colours.goldDark

// colours.songStar = colours.goldSaturated
// colours.spotifyMetric = colours.secondary1


const coloursDefault = new function() {
  this.goldSaturated = '#ea9918'
  this.goldDark = '#b38a42'
  this.goldMid = '#eeb064'
  this.goldLight = '#fcedbb'
  this.primary1 = '#8338ec'
  this.primary1accent = ''
  this.secondary1 = '#af2f91'
  this.secondary1accent = ''
  this.songsVizBg = '#110221c3'

  this.envMap = '/hdrs/fave_SciFi_hdri-hdr_VR360_view_expansive_blue_1356476283_10545987.hdr'

  this.textAbba = this.goldDark
  this.textTitle = this.primary1
  
  this.pointLight1 = this.primary1
  this.pointLight2 = this.goldDark
  
  this.songStar = this.goldSaturated
  this.spotifyMetric = this.secondary1
}

// colours.textAbba = '#00b4d8'

// #00b4d8 #fca311 #fb8500
// #8ac6af #eeb064 #ed9b88
// #af2f91, #111acc, #af2f91, #0c4bc6, #43c0f0, #9b5de5

// 2301.w019.n002.811B.p15.811 - yes // https://www.freepik.com/free-vector/abstract-tunnel-with-arches-glowing-with-neon-blue_37947626.htm
// hightech-concert-stage-with-bright-lights-lightup-floor - yes  // https://www.freepik.com/free-photo/hightech-concert-stage-with-bright-lights-lightup-floor_135009986.htm
// 3440060 - yes // https://www.freepik.com/free-vector/geometric-shapes-neon-lights-background_6849065.htm
// 2910936 - maybe 
// 2301.w019.n002.821A.p30.821 - maybe 
// 4Z_2101 - no 
// 2305 - no 
// 2305.w018.n002.1784B.p15.1784 - no 
// 2305.w018.n002.1787B.p15.1787 - maybe,  if it can be rotated 
// 2305.w019.n002.1070B.p15.1070 - maybe, if it can be rotated
// 3680646 - no 
// abstract-uv-ultraviolet-light-composition - maybe if it can be rotated
// circus_arena_2k - maybe 


const coloursOption2 = new function() {
  this.goldSaturated = '#ea9918'
  this.goldDark = '#b38a42'
  this.goldMid = '#eeb064'
  this.goldLight = '#fcedbb'
  this.primary1 = '#00b4d8'
  this.primary1accent = ''
  this.secondary1 = '#af2f91'
  this.secondary1accent = ''
  this.songsVizBg = '#021021c3'

  this.envMap = '/hdrs/fave_SciFi_hdri-hdr_VR360_view_expansive_blue_529834485_10545969.hdr'

  this.textAbba = this.goldDark
  this.textTitle = this.primary1
  
  this.pointLight1 = this.primary1
  this.pointLight2 = this.goldDark
  
  this.songStar = this.goldSaturated
  this.spotifyMetric = this.secondary1
}


export { coloursDefault, coloursOption2 } 