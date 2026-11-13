import {
  AnimationMixer, Box3, DirectionalLight, Group, HemisphereLight, Mesh, OrthographicCamera,
  Scene, Texture, Vector3, WebGLRenderer
} from "three";
import type { Object3D } from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const assets = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/models/`;

function splitWheels(model: Object3D) {
  const source = model.getObjectByName("Wheels_objs");
  const wheels: Group[] = [];
  if (!source) return wheels;
  const meshes: Mesh[] = [];
  source.traverse((child) => { if (child instanceof Mesh) meshes.push(child); });

  // The source model combines both rows and all three axles in each material primitive.
  for (const side of [-1, 1]) {
    for (let axle = 0; axle < 3; axle++) {
      const wheel = new Group();
      for (const mesh of meshes) {
        const geometry = mesh.geometry.clone();
        const positions = geometry.getAttribute("position");
        const original = geometry.index;
        const indices: number[] = [];
        for (let i = 0; i < (original?.count ?? positions.count); i += 3) {
          const a = original?.getX(i) ?? i;
          const b = original?.getX(i + 1) ?? i + 1;
          const c = original?.getX(i + 2) ?? i + 2;
          const x = (positions.getX(a) + positions.getX(b) + positions.getX(c)) / 3;
          const z = (positions.getZ(a) + positions.getZ(b) + positions.getZ(c)) / 3;
          if (Math.sign(x) === side && (z < -0.5 ? 0 : z > 0.5 ? 2 : 1) === axle) indices.push(a, b, c);
        }
        if (!indices.length) { geometry.dispose(); continue; }
        geometry.setIndex(indices);
        const bounds = new Box3();
        for (const index of indices) bounds.expandByPoint(new Vector3().fromBufferAttribute(positions, index));
        geometry.boundingBox = bounds;
        geometry.boundingSphere = null;
        const part = new Mesh(geometry, mesh.material);
        part.frustumCulled = false;
        wheel.add(part);
      }
      if (!wheel.children.length) continue;
      const pivot = new Box3().setFromObject(wheel).getCenter(new Vector3());
      wheel.position.copy(pivot);
      wheel.children.forEach((part) => part.position.sub(pivot));
      wheels.push(wheel);
    }
  }
  if (wheels.length === 6) {
    meshes.forEach((mesh) => { mesh.visible = false; });
    source.add(...wheels);
  } else {
    wheels.forEach((wheel) => wheel.traverse((part) => { if (part instanceof Mesh) part.geometry.dispose(); }));
    wheels.length = 0;
  }
  return wheels;
}

function disposeModel(model: Object3D) {
  model.traverse((part) => {
    if (!(part instanceof Mesh)) return;
    part.geometry.dispose();
    for (const material of Array.isArray(part.material) ? part.material : [part.material]) {
      for (const value of Object.values(material)) {
        if (value instanceof Texture) value.dispose();
      }
      material.dispose();
    }
  });
}

export function mountRover(lane: HTMLDivElement, paused: () => boolean, onReady: () => void) {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.domElement.addEventListener("webglcontextlost", handleContextLoss);
  lane.append(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1.8, -1.8, 0.1, 100);
  camera.position.set(0, 3.4, 14);
  camera.lookAt(0, 1.2, 0);
  const light = new DirectionalLight(0xffecd9, 2.6);
  light.position.set(-4, 7, 5);
  scene.add(light, new HemisphereLight(0xe0edff, 0x697187, 2));
  const vehicle = new Group();
  scene.add(vehicle);
  const draco = new DRACOLoader().setDecoderPath(`${assets}draco/`).setWorkerLimit(1);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let model: Object3D | undefined;
  let active = true;
  let disposed = false;
  let frame = 0;
  let distance = 0;
  let previous = 0;
  let time = 0;
  let halfWidth = 1;
  let ready = false;
  let needsRender = true;

  function handleContextLoss() {
    lane.parentElement?.setAttribute("data-model-ready", "false");
    cancelAnimationFrame(frame);
  }

  const resize = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = lane;
    if (!width || !height) return;
    halfWidth = width / height * 1.8;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    needsRender = true;
  });
  resize.observe(lane);
  const visibility = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; });
  visibility.observe(lane);

  void new GLTFLoader().setDRACOLoader(draco).loadAsync(`${assets}perseverance.glb`).then((gltf) => {
    if (disposed) { disposeModel(gltf.scene); return; }
    model = gltf.scene;
    const wheels = splitWheels(model);
    const head = model.getObjectByName("head");
    const mastClip = gltf.animations.find((clip) => clip.name === "CylinderAction");
    if (head && mastClip) {
      const mixer = new AnimationMixer(model);
      const action = mixer.clipAction(mastClip).play();
      const position = new Vector3();
      let highest = -Infinity;
      let raisedTime = 0;
      for (let i = 0; i < 64; i++) {
        const sampleTime = mastClip.duration * i / 64;
        mixer.setTime(sampleTime);
        const height = head.getWorldPosition(position).y;
        if (height > highest) {
          highest = height;
          raisedTime = sampleTime;
        }
      }
      action.time = raisedTime;
      mixer.update(0);
    }
    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    model.position.set(-center.x, -bounds.min.y, -center.z);
    vehicle.add(model);
    const shoulder = model.getObjectByName("arm003");
    const elbow = model.getObjectByName("arm002");
    const joints = [head, shoulder, elbow].map((joint) => ({ joint, rest: joint?.quaternion.clone() }));

    function render(now: number) {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!active) return;
      const moving = !paused() && !reduced.matches;
      if (!moving && !needsRender) return;
      if (moving) time += dt;
      needsRender = false;
      const travel = Math.max(0, halfWidth - 2.45);
      const cycle = time % 56;
      const progress = cycle < 25 ? cycle / 25 : cycle < 28 ? 1 : cycle < 53 ? 1 - (cycle - 28) / 25 : 0;
      const facing = cycle < 25 ? 1 : cycle < 28 ? Math.cos((cycle - 25) / 3 * Math.PI) : cycle < 53 ? -1 : -Math.cos((cycle - 53) / 3 * Math.PI);
      const x = (progress * 2 - 1) * travel;
      if (ready && moving) distance += Math.abs(x - vehicle.position.x);
      vehicle.position.x = x;
      vehicle.rotation.y = facing * 1.08;
      wheels.forEach((wheel) => { wheel.rotation.x = distance / 0.263; });
      const stopped = (cycle >= 25 && cycle < 28) || cycle >= 53;
      const reach = stopped ? Math.sin((cycle - (cycle >= 53 ? 53 : 25)) / 3 * Math.PI) : 0;
      const angles = [Math.sin(time * 0.9) * 0.4, reach * 0.2, -reach * 0.32];
      joints.forEach(({ joint, rest }, index) => {
        if (joint && rest) {
          joint.quaternion.copy(rest);
          if (index === 0) joint.rotateY(angles[index]);
          else joint.rotateX(angles[index]);
        }
      });
      renderer.render(scene, camera);
      if (!ready) { ready = true; onReady(); }
    }
    frame = requestAnimationFrame(render);
  }).catch(() => {});

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    visibility.disconnect();
    draco.dispose();
    if (model) disposeModel(model);
    renderer.domElement.removeEventListener("webglcontextlost", handleContextLoss);
    renderer.dispose();
    renderer.domElement.remove();
  };
}
