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

let mixer; // Declare a variable to hold the animation mixer
let idleAction; // Declare a variable to hold the idle animation action
let animations = []; // An array to store loaded animations

// Load the GLTF model and its animations
const loader = new THREE.GLTFLoader();
loader.load("./idle.glb", (gltf) => {
  const model = gltf.scene;

  // Scale, shadow, and other setup for the model here

  scene.add(model);

  // Get the animations from the loaded model
  animations = gltf.animations;

  // Create an AnimationMixer and associate it with the model
  mixer = new THREE.AnimationMixer(model);
  idleAction = mixer.clipAction(animations[10]); // Idle animation

  // Play the idle animation by default
  idleAction.play();

  // Add event listeners to workout buttons
  const workoutButtons = document.querySelectorAll(".workout-button");
  workoutButtons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
});
const planeGeometry = new THREE.BoxGeometry(10, 0.1, 10); // Create a cube-shaped plane with width, height, and depth (adjust as needed)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black color material
const plane = new THREE.Mesh(planeGeometry, planeMaterial); // Create a mesh with geometry and material
plane.position.set(0, -0.05, 0); // Set the position of the cube-shaped plane to (0, -0.05, 0) to avoid z-fighting with the ground plane
plane.receiveShadow = true; // Enable shadow casting for the cube-shaped plane
scene.add(plane); // Add the cube-shaped plane to the scene

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 5); // soft white light
scene.add(ambientLight);
// Function to handle button click events
function handleButtonClick(event) {
  const buttonId = event.target.id;
  const animationName = buttonToAnimation[buttonId];

  if (animationName) {
    // Find the animation corresponding to the clicked button
    const animation = animations.find((anim) => anim.name === animationName);

    if (animation) {
      // Stop the idle animation
      idleAction.stop();

      // Stop any currently playing animations
      mixer.stopAllAction();

      // Play the selected animation
      const action = mixer.clipAction(animation);
      action.play();
    }
  }
}
// Function to handle button click events
function handleButtonClick(event) {
  const buttonName = event.target.innerText;

  // Find the animation corresponding to the clicked button
  const animation = animations.find((anim) =>
    anim.name.toLowerCase().includes(buttonName.toLowerCase())
  );

  if (animation) {
    // Stop the idle animation
    idleAction.stop();

    // Stop any currently playing animations
    mixer.stopAllAction();

    // Play the selected animation
    const action = mixer.clipAction(animation);
    action.play();
  }
}

// Set up OrbitControls or any other controls you prefer
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
