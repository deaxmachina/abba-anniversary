import { Environment, Sky } from "@react-three/drei";

// https://polyhaven.com/a/cyclorama_hard_light
// https://polyhaven.com/a/circus_arena


export default function Lights() {
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

      {/* <pointLight 
        args={['#af2f91', 20, 5]} 
        position={[2.4, 0, 1.7]}
      /> */}
      {/* <pointLight 
        args={['#0c4bc6', 20, 2]} 
        position={[-0.2, 0, 3]}
      /> */}
      
      {/* <pointLight 
        args={['#43c0f0', 20, 2]} 
        position={[-0.2, 0, 3]}
      /> */}


      <pointLight 
        args={['rebeccapurple', 20, 2]} 
        position={[-0.2, 0, 3]}
      />
      <pointLight 
        args={['#b38a42', 30, 5]} 
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
        files="hdrs/fave_SciFi_hdri-hdr_VR360_view_expansive_blue_1356476283_10545987.hdr" 
        // files={[
        //   "hdrs/SciFi_cube-map-default-png_VR360_view_expansive_blue_529834485_10545969/cube_up.png",
        //   "hdrs/SciFi_cube-map-default-png_VR360_view_expansive_blue_529834485_10545969/cube_down.png",
        //   "hdrs/SciFi_cube-map-default-png_VR360_view_expansive_blue_529834485_10545969/cube_front.png",
        //   "hdrs/SciFi_cube-map-default-png_VR360_view_expansive_blue_529834485_10545969/cube_back.png",
        // ]}
      />
      {/* <Environment preset="city" ></Environment> */}
    </>
  );
}


// 2301.w019.n002.811B.p15.811 - yes // https://www.freepik.com/free-vector/abstract-tunnel-with-arches-glowing-with-neon-blue_37947626.htm
// hightech-concert-stage-with-bright-lights-lightup-floor - yes  // https://www.freepik.com/free-photo/hightech-concert-stage-with-bright-lights-lightup-floor_135009986.htm
// 3440060 - yes // https://www.freepik.com/free-vector/geometric-shapes-neon-lights-background_6849065.htm
// 2910936 - maybe 
// 2301.w019.n002.821A.p30.821 - maybe 



// 4Z_2101 - no 
// 2305 - no 
// 2305.w018.n002.1784B.p15.1784 - no 
// 2305.w018.n002.1787B.p15.1787 - maybe,  if it can be rotated 
// 2305.w019.n002.1070B.p15.1070 - maybe, if it can be rotated
// 3680646 - no 
// abstract-uv-ultraviolet-light-composition - maybe if it can be rotated
// circus_arena_2k - maybe 


