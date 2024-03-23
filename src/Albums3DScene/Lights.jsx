import { Environment, Sky } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      {/* <hemisphereLight
        args={['#ed9b88', '#eeb064', 5]} //
        position={[0, 5, 0]}
        castShadow={false}
      /> */}
      <rectAreaLight 
        args={['#ef476f', 10, 5, 20]}
        position={[0, 10, 0]}
        castShadow={false}
      />
      {/* <Environment background blur={2} preset="sunset" /> */}
    </>
  );
}
