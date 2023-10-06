// Set up scene
const scene = new THREE.Scene();

// Set up camera
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(
  -0.007830737003355681,
  5.8461286926353462,
  5.688741535228839
);
camera.rotation.set(
  -0.48633526555725765,
  -0.004223697536955033,
  -0.0022330160769621753
);

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x3498db); // Set plain color background (hexadecimal value for color)
renderer.shadowMap.enabled = true; // Enable shadows in renderer
document.getElementById("scene-container").appendChild(renderer.domElement);

// Add directional light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7); // Adjust the light position as needed
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load("./idle.glb", (gltf) => {
  const model = gltf.scene;

  // Scale the model (for example, scale it by 2 times along all axes)
  model.scale.set(2, 2, 2); // Adjust the scale factors as needed

  // Enable shadows for the model
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(model);

  // Adjust the target for OrbitControls
  const boundingBox = new THREE.Box3().setFromObject(model);
  const target = boundingBox.getCenter(new THREE.Vector3());
  camera.lookAt(target);
});

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 5); // soft white light
scene.add(ambientLight);

// Set up OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25; // friction factor (0: no damping, 1: full damping)
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation to avoid upside-down view

// Set up animation function
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();
  console.log(camera.position);
  console.log(camera.rotation);
  // Render the scene with the camera
  renderer.render(scene, camera);
}

// Call the animate function to start the animation loop
animate();
