// Code for this componet is from:
// https://codesandbox.io/p/sandbox/image-gallery-lx2h8?file=%2Fsrc%2FApp.js%3A1%2C1-102%2C2

import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, Html, Reflector, useTexture, Stars, Sky, Lightformer, SpotLight, Text3D, Center } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom,  DepthOfField, Noise, Vignette, LensFlare, Glitch, GodRays, Sepia } from '@react-three/postprocessing'
import { DotScreen } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import albums from './albums'
import Lights from './Lights'
import { AbbaText, AbbaTextAmbigram } from './AbbaText'

// #00b4d8 #fca311 #fb8500
// #8ac6af #eeb064 #ed9b88

const GOLDENRATIO = 1.61803398875
const RATIO = 1

const Scene = ({ 
  selectedAlbumId, setSelectedAlbumId, showHtml, setShowHtml, windowWidth, windowHeight 
}) => {
  const [location, setLocation] = useLocation()

  const z = windowWidth >= 1200 ? 0 : windowWidth >= 800 ? -2 : -4
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }} transparent={1} >
      {/* <color attach="background" args={['#000']} /> */}
      <fog attach="fog" args={['#191920', 0, 15]} />
      <Lights />
      <AbbaTextAmbigram windowWidth={windowWidth}/>

      <group position={[0, -0.5, z]}>
        {/* The image frames */}
        <Frames 
          albums={albums}
          setLocation={setLocation}
          selectedAlbumId={selectedAlbumId}
          setSelectedAlbumId={setSelectedAlbumId}
          setShowHtml={setShowHtml}
          showHtml={showHtml}
        />
        {/* The floor */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => { 
            // When the floor is clicked on, reset the scene and album; the html content will also disappear
            // Note that this is not ideal as the floor can overlap with the frames and then 
            // when you think you've clicked on the frame, you've clicked on the floor and reset the scene
            e.stopPropagation()
            setShowHtml(false)
            setSelectedAlbumId(null)
            setLocation('/')
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
            metalness={1}
          />
        </mesh>
      </group>
      {/* <Stars radius={100} depth={150} count={5000} factor={5} saturation={1} fade speed={2} /> */}
      <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.8} />
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
          {/* <Noise opacity={0.08} premultiply={false}/> */}
      </EffectComposer>
    </Canvas>
  )
}


function Frames({ 
  albums, setLocation, selectedAlbumId, setSelectedAlbumId, showHtml, setShowHtml, 
  q = new THREE.Quaternion(), p = new THREE.Vector3() 
}) {
  const refFrames = useRef()
  const clicked = useRef() // Store the object corresponding to the frame that has been clicked
  const [, params] = useRoute('/album/:id')
  useEffect(() => {
    clicked.current = refFrames.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, RATIO / 2, 1.25)) // TODO: Here is where you can set responsivness; original: 1.25
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
          setShowHtml(false)
          // setTimeout(() => {
          //   setShowHtml(false)
          // }, 1000)
        } else {
          setSelectedAlbumId(e.object.name)
          setLocation('/album/' + e.object.name)
          setShowHtml(false)
          setTimeout(() => {
            setShowHtml(true)
          }, 1500)
        }
      }}
      // onPointerMissed={() => {
      //   setSelectedAlbumId(null)
      //   setLocation('/')
      // }}
    >
      {
        albums.map((d) =>(
          <Frame 
            key={d.id} 
            position={d.position}
            rotation={d.rotation}
            colorDark={d.colorDark}
            colorLight={d.colorLight}
            imgUrl={d.imgUrl}
            id={d.id} // This will become the album id and needs to be renamed
            selectedAlbumId={selectedAlbumId} 
          />
        ))
      }
    </group>
  )
}

function Frame({ position, rotation, colorDark, colorLight, imgUrl, id, selectedAlbumId }) {
  const image = useRef()
  const frame = useRef()
  const [greyscale, setGreyscale] = useState(true)
  const [, params] = useRoute('/album/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = id // needs to be unique
  const isActive = params?.id === name
  useCursor(hovered)
  useFrame((state, dt) => {
    image.current.material.zoom = 1.5 + Math.sin(rnd * 10 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? '#fcedbb' : '#fff', 0.1, dt)
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
        <boxGeometry />
        <meshStandardMaterial color='#000' metalness={1.5} roughness={0.5} envMapIntensity={3} />

        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.94, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false}  />
        </mesh>
        <Image 
          raycast={() => null} 
          ref={image} 
          position={[0, 0, 0.7]} 
          url={imgUrl}
          // color='red'
          radius='0'
          grayscale={hovered || id === '0uUtGVj0y9FjfKful7cABY' ? false : true}
          // transparent={true}
          // opacity={0.5}
        />
      </mesh>

      {/* <Text maxWidth={0.4} anchorX="left" anchorY="top" position={[0, 1.35, 0]} fontSize={0.025}>
        name: {name} 1976
        {selectedAlbumId}
      </Text> */}
    </group>
      </>
  )
}


export default Scene