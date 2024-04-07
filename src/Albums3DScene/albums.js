const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const albums = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], imgUrl: './0uUtGVj0y9FjfKful7cABY.png', id: '0uUtGVj0y9FjfKful7cABY', name: 'Voyage', colorDark: '#93711C', colorLight: '#D0A028' }, 
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0],  imgUrl: './3Il2ad1NGO9zoY1FIVBuHD.png', id: '3Il2ad1NGO9zoY1FIVBuHD', name: 'Ring Ring', colorDark: '#782828', colorLight: '#D14646' }, 
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: './3JHZ83ohEBDLFQfbVfDHFh.png', id: '3JHZ83ohEBDLFQfbVfDHFh', name: 'The Visitors', colorDark: '#BB5D10', colorLight: '#C06010' }, 
  // Left
  { position: [-1.65, 0, 0.25], rotation: [0, Math.PI / 3, 0], imgUrl: './5fLOHW1UXr1cJrnXiU3FBt.png', id: '5fLOHW1UXr1cJrnXiU3FBt', name: 'The Album', colorDark: '#C4506D', colorLight: '#D85878' }, 
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], imgUrl: './3ZdkT5buYFi1WQaB0XNNtf.png', id: '3ZdkT5buYFi1WQaB0XNNtf', name: 'Super Trouper', colorDark: '#481010', colorLight: '#E13232' }, 
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], imgUrl: './7iLuHJkrb9KHPkMgddYigh.png', id: '7iLuHJkrb9KHPkMgddYigh', name: 'Voulez-Vous', colorDark: '#0068A0', colorLight: '#007CBF' }, 
  // Right
  { position: [1.65, 0, 0.25], rotation: [0, -Math.PI / 3, 0], imgUrl: './1kM6xcSYO5ASJaWgygznL7.png', id: '1kM6xcSYO5ASJaWgygznL7', name: 'ABBA', colorDark: '#482020', colorLight: '#C05555' }, 
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], imgUrl: './1V6a99EbTTIegOhWoPxYI9.png', id: '1V6a99EbTTIegOhWoPxYI9', name: 'Arrival', colorDark: '#481810', colorLight: '#D2462F' }, 
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0],  imgUrl: './5gSBDA6ufk8UZejT4XR7av.png', id: '5gSBDA6ufk8UZejT4XR7av', name: 'Waterloo', colorDark: '#903828', colorLight: '#CB4F38'  } 
]

const albumsTest = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], imgUrl: pexel(1103970), id: '0uUtGVj0y9FjfKful7cABY', name: 'Voyage', colorDark: '#93711C', colorLight: '#D0A028' }, 
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0],  imgUrl: pexel(416430), id: '3Il2ad1NGO9zoY1FIVBuHD', name: 'Ring Ring', colorDark: '#782828', colorLight: '#D14646' }, 
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: pexel(310452), id: '3JHZ83ohEBDLFQfbVfDHFh', name: 'The Visitors', colorDark: '#BB5D10', colorLight: '#C06010' }, 
  // Left
  { position: [-1.65, 0, 0.25], rotation: [0, Math.PI / 3, 0], imgUrl:  pexel(327482), id: '5fLOHW1UXr1cJrnXiU3FBt', name: 'The Album', colorDark: '#C4506D', colorLight: '#D85878' }, 
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], imgUrl: pexel(325185), id: '3ZdkT5buYFi1WQaB0XNNtf', name: 'Super Trouper', colorDark: '#481010', colorLight: '#E13232' }, 
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], imgUrl: pexel(358574), id: '7iLuHJkrb9KHPkMgddYigh', name: 'Voulez-Vous', colorDark: '#0068A0', colorLight: '#007CBF' }, 
  // Right
  { position: [1.65, 0, 0.25], rotation: [0, -Math.PI / 3, 0], imgUrl: pexel(227675), id: '1kM6xcSYO5ASJaWgygznL7', name: 'ABBA', colorDark: '#482020', colorLight: '#C05555' }, 
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], imgUrl: pexel(911738), id: '1V6a99EbTTIegOhWoPxYI9', name: 'Arrival', colorDark: '#481810', colorLight: '#D2462F' }, 
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0],  imgUrl: pexel(1738986), id: '5gSBDA6ufk8UZejT4XR7av', name: 'Waterloo', colorDark: '#903828', colorLight: '#CB4F38'  } 
]
// const images = [
//   // Front
//   { position: [0, 0, 1.5], rotation: [0, 0, 0], imgUrl: pexel(1103970), id: '1103970' },
//   // Back
//   { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: pexel(416430), id: '416430' },
//   { position: [0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: pexel(310452), id: '310452' },
//   // Left
//   { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], imgUrl: pexel(327482), id: '327482' },
//   { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], imgUrl: pexel(325185), id: '325185' },
//   { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], imgUrl: pexel(358574), id: '358574' },
//   // Right
//   { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], imgUrl: pexel(227675), id: '227675' },
//   { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], imgUrl: pexel(911738), id: '911738' },
//   { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], imgUrl: pexel(1738986), id: '1738986' }
// ]

export default albumsTest;