import { Environment, Sky } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      {/* <hemisphereLight
        args={['#c0284c', '#111acc', 5]} //
        position={[0, 5, 0]}
        castShadow={false}
      /> */}
      {/* <pointLight 
        args={['#af2f91', 100, 5]} 
        position={[2, 0, 2]}
      />
      <pointLight 
        args={['#0c4bc6', 100, 5]} 
        position={[-2, 1, 2]}
      /> */}
      {/* <rectAreaLight 
        args={['#b38a42', 4, 10, 20]}
        position={[0, 1, 0]}
        castShadow={false}
      /> */}
      <ambientLight
        intensity={1.5}
      />
      <directionalLight
        position={[0, 5, 0]}
        intensity={2}
      />
      {/* https://github.com/pmndrs/drei?tab=readme-ov-file#environment */}
      {/* https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts */}
      <Environment background={false} preset="forest" />
      {/* <Environment preset="city" ></Environment> */}
    </>
  );
}
