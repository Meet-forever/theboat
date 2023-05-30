import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { addEffect, Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Text,
  Html,
  ScrollControls,
  Scroll,
  OrbitControls,
  useIntersect,
  PositionalAudio,
  useScroll,
} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { DoubleSide, MathUtils } from "three";
import "./App.css";
import { gsap, Power1 } from "gsap";
import fonts from "./fonts";
import assets_01 from "./assets/01.png";
import assets_02 from "./assets/02.png";
import assets_03 from "./assets/03.png";
import assets_06 from "./assets/06.png";
import assets_08 from "./assets/08.png";
import assets_arrow from "./assets/arrow.png";
import assets_bg from "./assets/bg.png";
import assets_boat_01 from "./assets/boat-01.png";
import assets_cloud_pot_01 from "./assets/cloud-pot-01.png";
import assets_fog_pot from "./assets/fog-pot.png";
import assets_foreground_clouds_pot from "./assets/foreground-clouds-pot.png";
import assets_rain_light_pot from "./assets/rain-light-pot.png";
import assets_song_pt2_left_flower_01 from "./assets/song-pt2-left-flower-01.png";
import assets_song_pt2_left_flower_02 from "./assets/song-pt2-left-flower-02.png";
import assets_song_pt2_left_flower_03 from "./assets/song-pt2-left-flower-03.png";
import assets_song_pt2_left_leaf_02 from "./assets/song-pt2-left-leaf-02.png";
import assets_waves_pot from "./assets/waves-pot.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import msc from "./assets/TownTheme.mp3";
import msc from "./assets/rainloop.wav";
import msc2 from "./assets/awesomeness.wav"
gsap.registerPlugin(ScrollTrigger);

const Wave = (props) => {
  const waveTexture = useLoader(TextureLoader, props.href);
  const ref1 = useRef();
  const UpperBound = props.position[1] + 0.5,
    LowerBound = props.position[1] - 0.5;
  let sign = -1;
  useFrame(() => {
    ref1.current.position.y = ref1.current.position.y + sign * props.speed;
    if (
      ref1.current.position.y >= UpperBound ||
      ref1.current.position.y < LowerBound
    )
      sign *= -1;
  });
  return (
    <group>
      <mesh ref={ref1} position={props.position}>
        <meshLambertMaterial
          transparent={true}
          color={props.color ? props.color : 0x000000}
          map={waveTexture}
        />
        <planeGeometry args={props.size} />
      </mesh>
    </group>
  );
};
const Clouds = (props) => {
  const cloudsTexture = useLoader(TextureLoader, props.href);
  const ref1 = useRef();
  const ref2 = useRef();
  useFrame(() => {
    if (ref1.current.position.x < -props.size[0]) {
      ref1.current.position.x = props.position[0];
      ref2.current.position.x = props.size[0];
    } else {
      ref1.current.position.x -= props.speed;
      ref2.current.position.x -= props.speed;
    }
  });
  return (
    <group>
      <mesh ref={ref1} position={props.position}>
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
      <mesh
        ref={ref2}
        position={[
          props.size[0] + props.position[0],
          props.position[1],
          props.position[2],
        ]}
      >
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
    </group>
  );
};
const Rain = (props) => {
  const cloudsTexture = useLoader(TextureLoader, props.href);
  const ref1 = useRef();
  const ref2 = useRef();
  useFrame((state) => {
    if (ref1.current.position.y < -props.size[1] + 2) {
      ref1.current.position.y = props.position[1];
      ref2.current.position.y = props.size[1];
    } else {
      ref1.current.position.y -= props.speed;
      ref2.current.position.y -= props.speed;
    }
  });
  return (
    <group rotation={[0, 0, -0.5]}>
      <mesh ref={ref1} position={props.position}>
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
      <mesh
        ref={ref2}
        position={[
          props.position[0],
          props.position[1] + props.size[1],
          props.position[2],
        ]}
      >
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
    </group>
  );
};

const Boat = (props) => {
  const boatTexture = useLoader(TextureLoader, props.href);
  const songRef = useRef()
  const [ready, setReady] = useState(false);
  const ref1 = useRef();
  const RightBound = props.position[0] + 2,
    LeftBound = props.position[0] - 2;
  const RightBoundRotation = -Math.PI / 18,
    LeftBoundRotation = Math.PI / 18;
  let sign1 = 1, sign2 = props.sign ? props.sign : -1;
  const scroll = useScroll()
  useFrame((state) => {
    ref1.current.position.x = ref1.current.position.x + sign1 * 0.005;
    if(songRef.current && scroll.offset < 0.20){
      if(!songRef.current.isPlaying) songRef.current.play();
    }
    if(songRef.current && scroll.offset > 0.20){
        if(songRef.current.isPlaying) songRef.current.stop();
    }
    if (
      ref1.current.position.x >= RightBound ||
      ref1.current.position.x < LeftBound
    )
      sign1 *= -1;
    ref1.current.rotation.z = ref1.current.rotation.z + sign2 * 0.002;
    if (
      ref1.current.rotation.z < RightBoundRotation ||
      ref1.current.rotation.z > LeftBoundRotation
    )
      sign2 *= -1;
  });
  const handleClick = () =>{
    setReady(true);
  }
  return (
    <mesh ref={ref1} onClick={handleClick} position={props.position}>
      {ready && <PositionalAudio ref={songRef} autoplay={false} loop url={msc} distance={1}/>}
      <meshLambertMaterial transparent={true} map={boatTexture} />
      <planeGeometry args={props.size} />
    </mesh>
  );
};
const BackGround = () => {
  const bg = useLoader(TextureLoader, assets_bg);
  const ref = useRef();
  let sign = -1;
  const RightBound = -Math.PI / 16,
    LeftBound = Math.PI / 16;
  useFrame(() => {
    ref.current.rotation.z = ref.current.rotation.z + sign * 0.001;
    if (
      ref.current.rotation.z < RightBound ||
      ref.current.rotation.z > LeftBound
    )
      sign *= -1;
  });
  return (
    <mesh ref={ref} position={[0, -1, -3]}>
      <meshLambertMaterial map={bg} transparent={true} side={DoubleSide} />
      <planeGeometry args={[30, 12]} />
    </mesh>
  );
};

const BackGround2 = (props) => {
  const cloudsTexture = useLoader(TextureLoader, props.href);
  const ref1 = useRef();
  const ref2 = useRef();
  const visible = useRef(false)
  const rf = useIntersect((isVisible) => rf.current = isVisible)
  useFrame(() => {
    // console.log(visible)
    if (ref1.current.position.x < -props.size[0]) {
      ref1.current.position.x = props.position[0];
      ref2.current.position.x = props.size[0];
    } else {
      ref1.current.position.x -= props.speed;
      ref2.current.position.x -= props.speed;
    }
  });
  return (
    <group ref={rf}>
      <mesh ref={ref1} position={props.position}>
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
      <mesh
        ref={ref2}
        position={[
          props.size[0] + props.position[0],
          props.position[1],
          props.position[2],
        ]}
      >
        <meshLambertMaterial transparent={true} map={cloudsTexture} />
        <planeGeometry args={props.size} />
      </mesh>
    </group>
  );
};

const BasicIcon = (props) => {
  const ref = useRef();
  const iconTexture = useLoader(TextureLoader, props.href);
  return (
    <group
      position={[props.position[0], props.position[1], props.position[2]]}
      rotation={props.rotation ? [0, 0, 3.1] : [0, 0, 0]}
      ref={ref}
    >
    <mesh>
      <meshLambertMaterial
        transparent={true}
        color={props.color ? props.color : 0xffffff}
        map={iconTexture}
      />
      <planeGeometry args={props.size} />
    </mesh>
</group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <PerspectiveCamera
        fov={60}
        aspect={window.innerWidth / window.innerHeight}
        near={1.0}
        far={1000}
        position={[0, 0, 0]}
      />
    </>
  );
};

const AudioCompo = ({ready}) => {
  const songRef = useRef();
  const scroll = useScroll()
  useFrame(() => {
    if(songRef.current && scroll.offset > 0.25){
      if(!songRef.current.isPlaying) songRef.current.play();
    }
    if(songRef.current && (scroll.offset > 0.60 || scroll.offset  < 0.22)){
        if(songRef.current.isPlaying) songRef.current.stop();
    }
  })
  return(
    <group position={[0,-20,0]} >
      {ready && <PositionalAudio ref={songRef}  url={msc2} autoplay distance={2} loop/>} 
    </group>
  );
}

function App() {
  const [ready, setReady] = useState(false);
  const textRef = useCallback( ref => {
    if(ref !== null){
      gsap.to(ref.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        stagger: 1,
        ease: Power1.easeOut,
      });
    }
  },[]);

  return (
    <Canvas
      color="white"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      onWheel={(e) => {}}
      onTouchMove={(e) => {}}
    >
      <Suspense fallback={<Html>Loading</Html>}>
        <ScrollControls damping={0.3} pages={6.5}>
            <Scene />
            {/* <OrbitControls  enableZoom={false} /> */}
          <Scroll>
            <Clouds
              href={assets_cloud_pot_01}
              speed={0.008}
              size={[10, 3]}
              position={[0, 1, 0]}
            />
            <Clouds
              href={assets_foreground_clouds_pot}
              speed={0.01}
              size={[20, 4]}
              position={[0, 2.1, 0]}
            />
            <Rain
              href={assets_rain_light_pot}
              speed={0.1}
              size={[12, 6]}
              position={[2, -1, 0]}
            />
            <Rain
              href={assets_rain_light_pot}
              speed={0.1}
              size={[12, 6]}
              position={[0, -1, 0]}
            />
            <Clouds
              href={assets_foreground_clouds_pot}
              speed={0.03}
              size={[20, 4]}
              position={[0, 2.1, 0]}
            />
            <BackGround />
            <BackGround2
              href={assets_fog_pot}
              speed={0.2}
              size={[100, 22]}
              position={[0, 0, 0.5]}
            />
            <group position={[0, 0, 4]} ref={textRef}>
              <BasicIcon
                href={assets_arrow}
                size={[0.1, 0.1]}
                position={[0.2, -2.7, 1]}
              />
              <BasicIcon
                href={assets_arrow}
                size={[0.1, 0.1]}
                position={[-0.2, -2.7, 1]}
                rotation={true}
              />
              <Text
                font={fonts.Philosopher}
                scale={0.3}
                fontSize={1}
                position={[0, 0.8, 1]}
              >
                Welcome to
              </Text>
              <Text
                font={fonts.Philosopher}
                scale={0.5}
                fontSize={2}
                position={[0, 0, 1]}
              >
                The Boats
              </Text>
              <Text
                font={fonts.Philosopher}
                scale={0.3}
                fontSize={1}
                position={[0, -0.7, 1]}
              >
                Project
              </Text>
              <Text
                font={fonts.Philosopher}
                scale={0.2}
                fontSize={0.7}
                position={[0, -2.5, 1]}
              >
                scroll to move
              </Text>
            </group>
            <Boat
              href={assets_boat_01}
              speed={0.03}
              size={[5, 3]}
              position={[-3, -2, -1.5]}
              sign={1}
            />
            <Boat
              href={assets_boat_01}
              speed={0.03}
              size={[6, 4]}
              position={[0, -2, -1.5]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.01}
              size={[40, 4]}
              position={[8, -4, -2]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.01}
              size={[40, 4]}
              position={[0, -3, -2]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.01}
              size={[40, 4]}
              position={[-5, -4, -2]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.009}
              size={[40, 2]}
              position={[-2, -3.8, -1]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.01}
              size={[40, 4]}
              position={[-2, -4.5, 0]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.01}
              size={[40, 3]}
              position={[-2, -6, 0.5]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0.0}
              size={[40, 8]}
              position={[-2, -7, 0.7]}
            />
            <Wave
              href={assets_waves_pot}
              speed={0}
              size={[40, 6]}
              position={[-2, -8.5, 1]}
              color={0xffffff}
            />
            {/* <AudioCompo ready={ready} /> */}
            <group onClick={() => setReady(true)} position={[0, -15, 0]}>
              <Text
                font={fonts.Philosopher}
                color={0x303030}
                scale={0.5}
                fontSize={2}
                position={[0, 0, 1]}
              >
                The Act II
              </Text>
            </group>
            {[
              [0, -14, 0.5],
              [-2, -17, 0.6],
            ].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_flower_01}
                size={[3, 3]}
                color={"pink"}
                position={arr}
              />
            ))}
            {[
              [0, -16, 0.5],
              [-2, -16, 0.8],
              [-1.5, -15.6, 1],
              [2, -16, 1.2],
            ].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_leaf_02}
                size={[0.5, 0.5]}
                color={"pink"}
                position={arr}
              />
            ))}
            {[
              [0, -14, 0.5],
              [-4, -16, 0.8],
              [-2, -14, 0.8],
              [3, -15, 1.2],
              [2, -16, 1.2],
            ].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_flower_02}
                size={[3, 3]}
                color={"pink"}
                position={arr}
              />
            ))}
            {[[4, -17.5, 0.8]].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_flower_03}
                size={[3, 3]}
                color={"pink"}
                position={arr}
              />
            ))}
            <BasicIcon
              href={assets_01}
              size={[7, 2.5]}
              color={0xffffff}
              position={[0, -22, 1]}
            />
            {[[-3.5, -30, 2],
              [2, -26, -1],
              [-1, -28, -1]].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_flower_02}
                size={[3, 3]}
                color={"pink"}
                position={arr}
              />
            ))}
            {[[-4, -21, 1.2],
              [3.5, -26.5, 1.8],
              [-6, -26, 1],
              [-1.5, -23, -1]].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_flower_03}
                size={[3, 3]}
                color={"pink"}
                position={arr}
              />
            ))}
            {[
              [5, -22, -2],
              [0, -22, -1],
              [0, -26.5, -2],
              [-6, -26, -1],
              [3.5, -23.6, 1.5],
              [4, -24, -2],
            ].map((arr, key) => (
              <BasicIcon
                key={key}
                href={assets_song_pt2_left_leaf_02}
                size={[0.5, 0.5]}
                color={"pink"}
                position={arr}
              />
            ))}
            <BasicIcon
              href={assets_02}
              size={[7, 2.5]}
              color={0xffffff}
              position={[0, -25, 1]}
            />
            <BasicIcon
              href={assets_03}
              size={[7.5, 2.5]}
              color={0xffffff}
              position={[0, -28, 1]}
            />
            <group position={[0, -34, 0]}>
              <Text
                font={fonts.Philosopher}
                color={0x303030}
                scale={0.5}
                fontSize={2}
                position={[0, 0, 1]}
              >
                Technologies
              </Text>
            </group>
            <group position={[0, -35.5, 0]}>
              <Text
                maxWidth={13}
                font={fonts["Noto Sans"]}
                color={0x404040}
                scale={0.5}
                fontSize={0.4}
                position={[0, 0, 1]}
                textAlign={"justify"}
              >
                This project is made in React using react-three-fiber (a
                three.js library for React) for 3D stuff and GSAP for animation.
                It is highly customizable and scaleable.
              </Text>
            </group>
            <group position={[0, -40, 0]}>
              <Text
                font={fonts.Philosopher}
                color={0x303030}
                scale={0.5}
                fontSize={2}
                position={[0, 0, 1]}
              >
                The End
              </Text>
            </group>
            <BasicIcon
              href={assets_08}
              size={[7.5, 2.5]}
              color={0xffffff}
              position={[0, -42.3, 1]}
            />
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

export default App;