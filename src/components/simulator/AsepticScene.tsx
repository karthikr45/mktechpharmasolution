"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { useSessionStore } from "@/lib/session-store";

type HotspotKey =
  | "mirror"
  | "gownCheck"
  | "airlock"
  | "lineApproach"
  | "intervention"
  | "withdrawal"
  | "documentation";

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
      <Html distanceFactor={10} position={[0, 0.55, 0]} center>
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

function Cleanroom() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.5, -4.5]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {/* Left wall (gowning) */}
      <mesh position={[-6.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Grade markers on floor */}
      <FloorLabel pos={[-5, -1.49, 2]} text="Grade C — Gowning" color="#fbbf24" />
      <FloorLabel pos={[-1.5, -1.49, 2]} text="Grade B — Airlock" color="#38bdf8" />
      <FloorLabel pos={[2.5, -1.49, 2]} text="Grade A — LAF" color="#22c55e" />
    </group>
  );
}

function FloorLabel({
  pos,
  text,
  color,
}: {
  pos: [number, number, number];
  text: string;
  color: string;
}) {
  return (
    <group position={pos}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 0.5]} />
        <meshStandardMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <Html
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        transform
        distanceFactor={4}
      >
        <div
          className="pointer-events-none select-none font-mono text-[10px] whitespace-nowrap"
          style={{ color }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}

function GowningArea() {
  return (
    <group position={[-5, 0, 0]}>
      {/* Mirror */}
      <mesh position={[0, 0.5, -4.4]}>
        <boxGeometry args={[1.2, 1.8, 0.05]} />
        <meshStandardMaterial
          color="#0ea5e9"
          metalness={0.95}
          roughness={0.05}
          emissive="#0369a1"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Gown check station */}
      <mesh position={[0, -0.7, -2.5]}>
        <boxGeometry args={[0.8, 1.6, 0.6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.3} />
      </mesh>
    </group>
  );
}

function Airlock() {
  return (
    <group position={[-1.5, 0, -2]}>
      {/* Doorframe */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.4, 2.4]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.2}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>
      {/* Panel with green/red lights */}
      <mesh position={[1.1, 1, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.08]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[1.1, 1.1, 0.05]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[1.1, 0.95, 0.05]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function FillingLine() {
  const conveyor = useRef<Group>(null);
  useFrame((_, dt) => {
    if (conveyor.current) {
      conveyor.current.children.forEach((c, i) => {
        c.position.x += dt * 0.3;
        if (c.position.x > 1.8) c.position.x = -1.8 + (i * 0.01);
      });
    }
  });

  return (
    <group position={[3, 0, -1]}>
      {/* Line platform */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[4, 0.2, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Conveyor belt */}
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[3.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Vials on conveyor */}
      <group ref={conveyor}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[-1.8 + i * 0.4, -0.7, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
            <meshStandardMaterial
              color="#e2e8f0"
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* LAF hood */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 0.3, 1.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>

      {/* LAF beam — translucent downward column */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.9, 2.1, 1.1]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          emissive="#38bdf8"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Stalled vial (amber indicator) */}
      <mesh position={[0.2, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 12]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Reject chute */}
      <mesh position={[2.3, -0.9, 0.4]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* Documentation tablet on stand */}
      <mesh position={[-2.2, -0.4, 0.9]} rotation={[0, 0.3, -0.2]}>
        <boxGeometry args={[0.5, 0.35, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-2.19, -0.4, 0.92]} rotation={[0, 0.3, -0.2]}>
        <planeGeometry args={[0.44, 0.3]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Approach marker */}
      <mesh position={[-1.5, -1.39, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial
          color="#22c55e"
          transparent
          opacity={0.5}
          emissive="#22c55e"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

export default function AsepticScene() {
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const finished = useSessionStore((s) => s.finished);
  const steps = useSessionStore((s) => s.steps);
  const scenarioId = useSessionStore((s) => s.scenarioId);
  const tryHotspot = useSessionStore((s) => s.tryHotspot);

  const isAseptic = scenarioId === "sop_as_001";
  const expectedStep = isAseptic && !finished ? steps[currentIndex] : undefined;
  const activeHotspot = expectedStep?.hotspot as HotspotKey | undefined;

  const hotspots: Array<{
    key: HotspotKey;
    label: string;
    position: [number, number, number];
  }> = [
    { key: "mirror", label: "Gowning Mirror", position: [-5, 0.5, -4] },
    { key: "gownCheck", label: "Gown Check", position: [-5, 0.2, -2.3] },
    { key: "airlock", label: "Airlock", position: [-1.5, 0.5, -1.8] },
    { key: "lineApproach", label: "Approach Mark", position: [1.5, -1.0, 0.8] },
    { key: "intervention", label: "Intervention Zone", position: [3.2, 0, -1] },
    { key: "withdrawal", label: "Reject Chute", position: [5.3, -0.5, -0.6] },
    { key: "documentation", label: "Batch Record", position: [0.8, -0.4, -0.1] },
  ];

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ position: [6, 4, 7], fov: 45 }}>
        <color attach="background" args={["#0a0f1e"]} />
        <fog attach="fog" args={["#0a0f1e", 12, 30]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[6, 10, 4]}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[3, 3, 0]} intensity={0.4} color="#38bdf8" />
        <Suspense fallback={null}>
          <Cleanroom />
          <GowningArea />
          <Airlock />
          <FillingLine />
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
            position={[0, -1.49, 0]}
            opacity={0.4}
            blur={2.5}
            scale={14}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[10px] text-slate-500 font-mono">
        drag to orbit · scroll to zoom
      </div>
    </div>
  );
}
