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

let mixer; // Declare a variable to hold the animation mixer

// Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load("./burpee.glb", (gltf) => {
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

  // Create an AnimationMixer and associate it with the model
  mixer = new THREE.AnimationMixer(model);

  // Get all the animations from the loaded model
  const animations = gltf.animations;

  // Check if there are animations
  if (animations && animations.length > 0) {
    // For simplicity, let's assume the first animation is the one you want to play
    const firstAnimation = animations[0];

    // Create an AnimationAction to play the animation
    const action = mixer.clipAction(firstAnimation);

    // Play the animation
    action.play();
  }

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

  // Update the animation mixer
  if (mixer) {
    mixer.update(0.01); // Update the animation (adjust the time delta as needed)
  }

  // Render the scene with the camera
  renderer.render(scene, camera);
}

// Call the animate function to start the animation loop
animate();
