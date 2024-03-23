const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const albums = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], imgUrl: './1OC16r1BdQO6hK2iqmvwXF.png', id: '0'},
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: './0mb5Q9w5GJKU7HClkEzHpy.png', id: '1' },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], imgUrl: './0sI9HAbEJn1eqWsxyFsf1I.png', id: '2' },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], imgUrl: './1lDo24S34NvI1pAg7Oxldc.png', id: '3' },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], imgUrl: './0gkax94ZwlPz1XbtCVg4Vd.png', id: '4' },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], imgUrl: './4HgjdBhRMGZ4jLWnjpTtMu.png', id: '5' },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], imgUrl: './6yZv0Nl6BXABbXoPVpfF5y.png', id: '6' },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], imgUrl: './65EhfozJEurgR34SyrNV3P.png', id: '7' },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], imgUrl: './67WqQt65XzFxgqwAfJu7fZ.png', id: '8' }
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

export default albums;