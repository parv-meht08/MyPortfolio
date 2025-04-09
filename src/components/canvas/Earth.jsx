import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

// Placeholder component for debugging
const PlaceholderEarth = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial
      color="#90EE90"
      emissive="#ffffff"
      emissiveIntensity={0.2}
      metalness={0.1}
      roughness={0.7}
    />
  </mesh>
);

const Earth = () => {
  const [error, setError] = useState(null);
  const { scene } = useGLTF("/planet/planet/scene.gltf", undefined, (error) => {
    console.error("Error loading GLTF model:", error);
    setError(error);
  });

  // If there's an error, return the placeholder
  if (error) {
    return <PlaceholderEarth />;
  }

  // Apply a color mix to the Earth model
  scene.traverse((child) => {
    if (child.isMesh) {
      // Create a new material that doesn't depend on textures
      child.material = new MeshStandardMaterial({
        color: "#90EE90",
        emissive: "#ffffff",
        emissiveIntensity: 0.2,
        metalness: 0.1,
        roughness: 0.7,
      });
    }
  });

  return (
    <primitive
      object={scene}
      scale={3}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

const EarthCanvas = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Loading...
        </div>
      )}
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
};

export default EarthCanvas;
