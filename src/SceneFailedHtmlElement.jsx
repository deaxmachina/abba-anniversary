// Code for this componet is from:
// https://codesandbox.io/p/sandbox/image-gallery-lx2h8?file=%2Fsrc%2FApp.js%3A1%2C1-102%2C2

import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, Html, Reflector, useTexture } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom } from '@react-three/postprocessing'


const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
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
const GOLDENRATIO = 1.61803398875
const RATIO = 1

const SceneTest = () => {
  const [location, setLocation] = useLocation()
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [selectedAlbumIds, setSelectedAlbumIds] = useState([null])
  const [hiddenHtml, setHiddenHtml] = useState(true)
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        {/* The image frames */}
        <Frames 
          images={images}
          setLocation={setLocation}
          selectedAlbumId={selectedAlbumId}
          setSelectedAlbumId={setSelectedAlbumId}
          hiddenHtml={hiddenHtml}
          setHiddenHtml={setHiddenHtml}
          setSelectedAlbumIds={setSelectedAlbumIds}
          selectedAlbumIds={selectedAlbumIds}
        />
        {/* The floor */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => { 
            // When the floor is clicked on, reset the scene and album; the html content will also disappear
            // Note that this is not ideal as the floor can overlap with the frames and then 
            // when you think you've clicked on the frame, you've clicked on the floor and reset the scene
            // e.stopPropagation()
            // setTimeout(() => {
            //   setHiddenHtml(true)
            // }, 1000)
            // setSelectedAlbumId(null)
            // setLocation('/')
          }}
        >
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      </group>
      <Environment preset="city" />
      <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
      </EffectComposer>
    </Canvas>
  )
}


function Frames({ 
  images, setLocation, selectedAlbumId, setSelectedAlbumId, hiddenHtml, setHiddenHtml, setSelectedAlbumIds, selectedAlbumIds,
  q = new THREE.Quaternion(), p = new THREE.Vector3() 
}) {
  const refFrames = useRef()
  const clicked = useRef() // Store the object corresponding to the frame that has been clicked
  const [, params] = useRoute('/album/:id')
  useEffect(() => {
    clicked.current = refFrames.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, RATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
    //console.log('clicked', clicked.current)
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={refFrames}
      onClick={(e) => { 
        e.stopPropagation()
        // setLocation(clicked.current === e.object ? '/' : '/album/' + e.object.name) // Original code
        // Logic to make sure that if the same Frame is clicked again there will be no selected album
        // Only set the selected Frame to currently clicked one, and don't reset the scene under any conditions
        // here (currently just resetting from clicking on the floor)

        if (clicked.current === e.object) {
          console.log('current is clicked again')
          //setSelectedAlbumId(null)
          setSelectedAlbumId(e.object.name)
          // setLocation('/')
          setLocation('/album/' + e.object.name)
          setTimeout(() => {
            setHiddenHtml(true)
          }, 1000)
        } else {
          setSelectedAlbumId(e.object.name)
          setLocation('/album/' + e.object.name)
          setHiddenHtml(true)
          setTimeout(() => {
            setHiddenHtml(false)
          }, 1000)
          setSelectedAlbumIds(d => [...d, e.object.name])
        }
        
        //console.log('e.object.name', e.object.name)
        console.log('selectedAlbumId', selectedAlbumId)
        // console.log('clicked.current', clicked.current)
      }}
      // onPointerMissed={() => {
      //   setSelectedAlbumId(null)
      //   setLocation('/')
      // }}
    >
      {
        images.map((d) =>(
          <Frame 
            key={d.id} 
            position={d.position}
            rotation={d.rotation}
            imgUrl={d.imgUrl}
            id={d.id} // This will become the album id and needs to be renamed
            selectedAlbumId={selectedAlbumId} 
            hiddenHtml={hiddenHtml}
            clicked={clicked}
            selectedAlbumIds={selectedAlbumIds}
          />
        ))
      }
    </group>
  )
}

function Frame({ position, rotation, imgUrl, id, selectedAlbumId, hiddenHtml, clicked, selectedAlbumIds }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/album/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = id // getUuid(url) // Note that this needs to be unique
  const isActive = params?.id === name
  const [clickedText, setClickedText] = useState('hello')
  useCursor(hovered)
  useFrame((state, dt) => {
    image.current.material.zoom = 1.5 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'aqua', 0.1, dt)
  })
  return (
    <>
    <group 
      position={position} 
      rotation={rotation} 
      imgUrl={imgUrl} 
    >
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.2, RATIO*1.2, 0.05]}
        position={[0, RATIO*1.2 * 0.5, 0]}
      >
        {/* HTML element where the data viz will live */}
        {
          name === selectedAlbumId &&
            <Html
                  key={name}
                  as='div' // Wrapping element (default: 'div')
                  wrapperClass='test-wrapper-div'
                  center
                  occlude={false}
                  sprite
                  zIndexRange={[2, 0]}
                  distanceFactor={1}
                  style={{
                    transition: 'all 1.5s',
                    border: '2px solid red',
                    width: '600px',
                    height: '350px',
                    background: 'rgba(9, 99, 99, 1)',
                    zIndex: 2,
                    // opacity: hiddenHtml ? 0 : 1,
                  }}
                >
                    <h1 
                      onClick = { () => clickedText === 'hello' ? setClickedText('belloooo') : setClickedText('hello') }
                    >
                      {clickedText}
                    </h1>
                    <p>world</p>
                    <button style={{ cursor: 'pointer' }}>click me</button>
            </Html>
          }
        <boxGeometry />
        <meshStandardMaterial color="hotpink" metalness={1.5} roughness={0.5} envMapIntensity={3} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={imgUrl} />
      </mesh>
      <Text maxWidth={0.4} anchorX="left" anchorY="top" position={[0, 1.35, 0]} fontSize={0.025}>
        name: {name} 1976
        {/* {selectedAlbumId} */}
      </Text>
    </group>
      </>
  )
}


export default SceneTest