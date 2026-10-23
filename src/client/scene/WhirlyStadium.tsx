import { Suspense, useMemo, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, type Group } from 'three';
import { WHIRLY_MODEL_URL } from './whirly-model.js';

interface Props { compact: boolean; lowQuality: boolean; fallback: ReactNode }

function WhirlyModel({ scene, compact, lowQuality }: Omit<Props, 'fallback'> & { scene: Group }) {
  const model = useMemo(() => {
    const instance = scene.clone(true);
    instance.traverse(object => {
      if (object instanceof Mesh) {
        object.castShadow = !lowQuality;
        object.receiveShadow = !lowQuality;
      }
    });
    return instance;
  }, [scene, lowQuality]);
  return <group rotation={[0, compact ? -Math.PI / 2 : 0, 0]}>
    <primitive object={model} dispose={null} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.925, 0]} receiveShadow>
      <planeGeometry args={[240, 240]} /><meshStandardMaterial color="#e3dcca" roughness={1} />
    </mesh>
  </group>;
}

function WhirlyAsset({ fallback, ...props }: Props) {
  let scene: Group;
  try {
    scene = useGLTF(WHIRLY_MODEL_URL).scene;
  } catch (error) {
    if (error && typeof (error as { then?: unknown }).then === 'function') throw error;
    // Match the racer loader: a failed sculpture must not remove the playable board.
    return fallback;
  }
  return <WhirlyModel scene={scene} {...props} />;
}

export function WhirlyStadium(props: Props) {
  return <Suspense fallback={props.fallback}><WhirlyAsset {...props} /></Suspense>;
}
