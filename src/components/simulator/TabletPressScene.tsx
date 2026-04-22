"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import type { Mesh, Group } from "three";
import { useSessionStore } from "@/lib/session-store";
import { CHANGEOVER_STEPS } from "@/lib/changeover-flow";

type HotspotKey =
  | "statusLight"
  | "turret"
  | "cleaningCart"
  | "hmi"
  | "hopper"
  | "dischargeChute";

interface HotspotProps {
  hotspotKey: HotspotKey;
  label: string;
  position: [number, number, number];
  onPick: (key: HotspotKey) => void;
  active: boolean;
}

function Hotspot({ hotspotKey, label, position, onPick, active }: HotspotProps) {
  const [hover, setHover] = useState(false);
  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPick(hotspotKey);
        }}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={active ? "#38bdf8" : hover ? "#60a5fa" : "#94a3b8"}
          emissive={active ? "#38bdf8" : "#0f172a"}
          emissiveIntensity={active ? 0.8 : 0.15}
          transparent
          opacity={0.9}
        />
      </mesh>
      {active && <PulseRing />}
      <Html distanceFactor={10} position={[0, 0.5, 0]} center>
        <div
          className={`pointer-events-none select-none whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium shadow ${
            active
              ? "bg-pharma-accent text-pharma-bg"
              : "bg-pharma-panel/90 text-slate-200 border border-pharma-border"
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function PulseRing() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 3) * 0.25;
    if (ref.current) {
      ref.current.scale.set(s, s, s);
      const mat = ref.current.material as { opacity: number };
      mat.opacity = 0.4 + Math.cos(t * 3) * 0.25;
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.45, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
    </mesh>
  );
}

function PressBody() {
  const turret = useRef<Group>(null);
  useFrame((_, delta) => {
    if (turret.current) turret.current.rotation.y += delta * 0.4;
  });

  return (
    <group>
      {/* Floor plinth */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Main enclosure */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[3, 2, 2.4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Glass window */}
      <mesh position={[0, -0.3, 1.21]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshStandardMaterial
          color="#0ea5e9"
          transparent
          opacity={0.25}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* Turret (rotating) */}
      <group ref={turret} position={[0, -0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55]}
            >
              <cylinderGeometry args={[0.07, 0.07, 0.34, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
            </mesh>
          );
        })}
      </group>

      {/* Hopper */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.65, 0.2, 1.2, 20]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 20]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* HMI panel */}
      <mesh position={[1.75, 0.1, 0.6]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.9, 0.6, 0.08]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[1.76, 0.1, 0.63]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[0.78, 0.48]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Status light tower */}
      <mesh position={[-1.6, 0.6, -0.8]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {[
        { y: 1.25, c: "#22c55e" },
        { y: 1.1, c: "#f59e0b" },
        { y: 0.95, c: "#ef4444" },
      ].map((l, i) => (
        <mesh key={i} position={[-1.6, l.y, -0.8]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={l.c}
            emissive={l.c}
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}

      {/* Discharge chute */}
      <mesh position={[-1.4, -0.7, 1.05]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.9]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cleaning cart */}
      <group position={[2.4, -1.2, -0.8]}>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.4]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
        <mesh position={[0, -0.35, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

export default function TabletPressScene() {
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const finished = useSessionStore((s) => s.finished);
  const tryHotspot = useSessionStore((s) => s.tryHotspot);
  const expectedStep = !finished ? CHANGEOVER_STEPS[currentIndex] : undefined;
  const activeHotspot = expectedStep?.hotspot as HotspotKey | undefined;

  const hotspots: Array<{
    key: HotspotKey;
    label: string;
    position: [number, number, number];
  }> = [
    { key: "statusLight", label: "Status Light", position: [-1.6, 1.5, -0.8] },
    { key: "turret", label: "Turret / Tooling", position: [0, 0, 0.9] },
    { key: "cleaningCart", label: "Cleaning Cart", position: [2.4, -0.7, -0.8] },
    { key: "hmi", label: "HMI Panel", position: [1.9, 0.4, 0.55] },
    { key: "hopper", label: "Hopper", position: [0, 1.3, 0.6] },
    { key: "dischargeChute", label: "Discharge Chute", position: [-1.4, -0.4, 1.4] },
  ];

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ position: [5, 3, 6], fov: 45 }}>
        <color attach="background" args={["#0a0f1e"]} />
        <fog attach="fog" args={["#0a0f1e", 10, 25]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-4, 3, -4]} intensity={0.3} color="#38bdf8" />
        <Suspense fallback={null}>
          <PressBody />
          {hotspots.map((h) => (
            <Hotspot
              key={h.key}
              hotspotKey={h.key}
              label={h.label}
              position={h.position}
              onPick={(k) => tryHotspot(k)}
              active={h.key === activeHotspot}
            />
          ))}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            blur={2}
            scale={10}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[10px] text-slate-500 font-mono">
        drag to orbit · scroll to zoom
      </div>
    </div>
  );
}
