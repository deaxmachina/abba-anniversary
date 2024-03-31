import {  Text3D, Center, useMatcapTexture } from '@react-three/drei'
import { colours } from '../assets/colours'


const AbbaText = () => {
  return (
    <>
      {/* <Center top center > */}
        <Text3D
        castShadow={false}
        receiveShadow={false}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.0001}
        bevelThickness={0.01}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        size={3.3}
        font="/Inter_Bold.json"
        position={[-6.6, -0.5, -2]}
      >
        {`ABBA`}
        <meshStandardMaterial castShadow={false} color='#fff' />
      </Text3D>
    {/* </Center> */}
    </>
  )
}

// #b38a42
// #fcd09f
// #eeb064
// Nice mapcaps:  47, 169, 194, 217, 233, 270, 284, 285, 294


const AbbaTextAmbigram = ({ 
  windowWidth,
  curveSegments=32, bevelEnabled=true, bevelSize=0.001, bevelThickness=0.01,  height=0.5, 
  lineHeight=0.5, letterSpacing=-0.1, size=4, font="fonts/Sarabun Medium_Regular.json", color=colours.textAbba
}) => {
  const xOffset = -6
  // TODO: this needs to be replaced, host locally!!! 
  const [matcap, url] = useMatcapTexture(
    294, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
   )
  const z = windowWidth >= 1200 ? -2 : windowWidth >= 900 ? -4 : -6
  return (
    <>
      <Text3D
        curveSegments={curveSegments}
        bevelEnabled={bevelEnabled}
        bevelSize={bevelSize}
        bevelThickness={bevelThickness}
        height={height}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        size={size}
        font={font}
        position={[xOffset + 0.2, -0.5, z]}
      >
        {`A`}
        <meshMatcapMaterial matcap={matcap} color={color} />
      </Text3D>
      <Text3D
        curveSegments={curveSegments}
        bevelEnabled={bevelEnabled}
        bevelSize={bevelSize}
        bevelThickness={bevelThickness}
        height={height}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        size={size}
        font={font}
        position={[xOffset+6.2, -0.5, z]}
        scale={[-1, 1, 1]}
      >
        {`B`}
        <meshMatcapMaterial matcap={matcap} color={color} />
      </Text3D>
      <Text3D
        curveSegments={curveSegments}
        bevelEnabled={bevelEnabled}
        bevelSize={bevelSize}
        bevelThickness={bevelThickness}
        height={height}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        size={size}
        font={font}
        position={[xOffset + 5.8, -0.5, z]}
      >
        {`B`}
        <meshMatcapMaterial matcap={matcap} color={color} />
      </Text3D>
      <Text3D
        curveSegments={curveSegments}
        bevelEnabled={bevelEnabled}
        bevelSize={bevelSize}
        bevelThickness={bevelThickness}
        height={height}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        size={size}
        font={font}
        position={[xOffset + 8.5, -0.5, z]}
      >
        {`A`}
        <meshMatcapMaterial matcap={matcap} color={color} />
      </Text3D>
    {/* </Center> */}
    </>
  )
}

const VoyageText = () => {
  return (
    <>
      {/* <Center top center > */}
      <Text3D
        castShadow={false}
        receiveShadow={false}
        curveSegments={32}
        bevelEnabled={false}
        bevelSize={0.0001}
        bevelThickness={0.01}
        height={0.001}
        lineHeight={0.1}
        letterSpacing={-0.06}
        size={0.4}
        font="/fonts/Licorice_Regular.json"
        position={[-0.5, -0.5, 4.1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        {`Voyage`}
        <meshStandardMaterial color={colours.textTitle} />
      </Text3D>
    {/* </Center> */}
    </>
  )
}

// Licorice_Regular.json

export { AbbaText, AbbaTextAmbigram, VoyageText }