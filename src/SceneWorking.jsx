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
// const images = [
//   // Front
//   { position: [0, 0, 1.5], rotation: [0, 0, 0], url: './0gkax94ZwlPz1XbtCVg4Vd.png' },
//   // Back
//   { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: './0mb5Q9w5GJKU7HClkEzHpy.png' },
//   { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: './0sI9HAbEJn1eqWsxyFsf1I.png' },
//   // Left
//   { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: './1lDo24S34NvI1pAg7Oxldc.png' },
//   { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: './1OC16r1BdQO6hK2iqmvwXF.png' },
//   { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: './4HgjdBhRMGZ4jLWnjpTtMu.png' },
//   // Right
//   { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: './6yZv0Nl6BXABbXoPVpfF5y.png' },
//   { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: './65EhfozJEurgR34SyrNV3P.png' },
//   { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: './67WqQt65XzFxgqwAfJu7fZ.png' }
// ]
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970) },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574) },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675) },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) }
]
const GOLDENRATIO = 1.61803398875
const RATIO = 1

const SceneTest = () => (
  <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['rebeccapurple']} />
    <fog attach="fog" args={['#191920', 0, 15]} />
    <group position={[0, -0.5, 0]}>
      {/* The image frames */}
      <Frames images={images} />
      {/* The floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
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
      {/* Alternative floor */}
      {/* <Ground 
        mirror={1} 
        blur={[500, 100]} 
        mixBlur={12} 
        mixStrength={1.5} 
        rotation={[-Math.PI / 2, 0, Math.PI / 2]} 
        position-y={-0.6}
      /> */}
    </group>
    <Environment preset="city" />
    <EffectComposer multisampling={8}>
        <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
        <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
    </EffectComposer>
  </Canvas>
)

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, RATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      onClick={(e) => { 
        e.stopPropagation()
        setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name)
      }}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url) // Note that this needs to be unique
  const isActive = params?.id === name
  const [hiddenHtml, setHiddenHtml] = useState(true)
  useCursor(hovered)
  useFrame((state, dt) => {
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'aqua', 0.1, dt)
  })
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.2, RATIO*1.2, 0.05]}
        position={[0, RATIO*1.2 * 0.5, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" metalness={1.5} roughness={0.5} envMapIntensity={3} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
        {/* Testing out some html which will need to cover the whole image 
        and only appear when that image is clicked; this is where all 
        the viz will live */}
        {/* <Html
          as='div' // Wrapping element (default: 'div')
          wrapperClass='test-wrapper-div'
          prepend
          center
          style={{
            transition: 'all 0.5s',
            border: '10px solid red',
            width: '650px',
            height: '650px',
            pointerEvents: 'none'
            // opacity: hiddenHtml ? 0 : 1,
            // transform: `scale(${hiddenHtml ? 0 : 1})`
          }}
        >
          <h1>hello</h1>
          <p>world</p>
        </Html> */}
      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, RATIO, 0]} fontSize={0.025}>
        The name of the album
        {/* {name.split('-').join(' ')} */}
      </Text>
    </group>
  )
}

function Ground(props) {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Reflector resolution={1024} args={[8, 8]} {...props}>
      {(Material, props) => <Material color="#f0f0f0" metalness={0} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

export default SceneTest