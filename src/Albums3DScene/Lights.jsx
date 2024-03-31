import { Environment, Sky } from "@react-three/drei";


// https://polyhaven.com/a/cyclorama_hard_light
// https://polyhaven.com/a/circus_arena


export default function Lights({ colours }) {
  return (
    <>
      {/* <hemisphereLight
        args={['#c0284c', '#111acc', 5]} //
        position={[0, 5, 0]}
        castShadow={false}
      /> */}
      {/* <rectAreaLight 
        args={['#b38a42', 4, 10, 20]}
        position={[0, 1, 0]}
        castShadow={false}
      /> */}
      <pointLight 
        args={[colours.pointLight1, 20, 2]} 
        position={[-0.2, 0, 3]}
      />
      <pointLight 
        args={[colours.pointLight2, 30, 5]} 
        position={[2.4, 0, 1.7]}
      />

      <ambientLight
        intensity={1.5}
      />
      <directionalLight
        position={[0, 5, 0]}
        intensity={2}
      />
      {/* https://github.com/pmndrs/drei?tab=readme-ov-file#environment */}
      {/* https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts */}
      {/* <Environment background={true} preset="forest" /> */}
      <Environment 
        background={true} 
        files={colours.envMap} 
      />
    </>
  );
}

