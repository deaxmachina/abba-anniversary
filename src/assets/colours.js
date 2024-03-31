
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


const colours = new function() {
  this.goldSaturated = '#ea9918'
  this.goldDark = '#b38a42'
  this.goldMid = '#eeb064'
  this.goldLight = '#fcedbb'
  this.primary1 = '#8338ec'
  this.primary1accent = ''
  this.secondary1 = '#af2f91'
  this.secondary1accent = ''

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

const envMap = ''

export { colours } 