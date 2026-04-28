import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // High-fidelity textures from Three.js examples (CORS friendly)
  const texture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  const specMap = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

  useFrame(({ clock }) => {
    if (earthRef.current) {
      // Significantly increased full 360-degree rotation speed
      earthRef.current.rotation.y = clock.getElapsedTime() * 2.5;
    }
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 96, 96]} />
        <meshPhongMaterial 
          map={texture} 
          specularMap={specMap}
          shininess={25}
          // Sharper sapphire/emerald contrast
          color="#ffffff"
          emissive={new THREE.Color("#005acd")}
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Cinematic Atmospheric Glow (Blue Fresnel) */}
      <mesh scale={1.05}>
        <sphereGeometry args={[2.5, 96, 96]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color('#005acd') },
          }}
          vertexShader={`
            varying float intensity;
            void main() {
              vec3 vNormal = normalize( normalMatrix * normal );
              intensity = pow( 1.1 - dot( vNormal, vec3(0,0,1) ), 4.0 );
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
              vec3 glow = glowColor * intensity;
              gl_FragColor = vec4( glow, intensity );
            }
          `}
        />
      </mesh>
    </group>
  );
}

export const PerfectEarth: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#005acd" />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </div>
  );
};
