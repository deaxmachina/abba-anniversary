import {  Text3D, Center } from '@react-three/drei'


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


const AbbaTextAmbigram = ({ 
  curveSegments=32, bevelEnabled=true, bevelSize=0.001, bevelThickness=0.01,  height=0.5, 
  lineHeight=0.5, letterSpacing=-0.1, size=3.3, font="/Inter_Bold.json", color='#fcd09f'
}) => {
  const xOffset = -6
  return (
    <>
    {/* <Center top center > */}
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
        position={[xOffset, -0.5, -2]}
      >
        {`A`}
        <meshStandardMaterial color={color} />
      </Text3D>
      {/* The inverted B */}
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
        position={[xOffset+6, -0.5, -2]}
        scale={[-1, 1, 1]}
      >
        {`B`}
        <meshStandardMaterial color={color} />
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
        position={[xOffset + 6, -0.5, -2]}
      >
        {`B`}
        <meshStandardMaterial color={color} />
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
        position={[xOffset + 8.7, -0.5, -2]}
      >
        {`A`}
        <meshStandardMaterial color={color} />
      </Text3D>
    {/* </Center> */}
    </>
  )
}

export { AbbaText, AbbaTextAmbigram }