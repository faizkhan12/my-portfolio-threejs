import CameraControls from "camera-controls"
import * as THREE from "three"
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "./node_modules/three/examples/jsm/loaders/OBJLoader"
import "./style.css"

CameraControls.install({ THREE: THREE })

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
})
scene.fog = new THREE.FogExp2(0x11111f, 0.002)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(scene.fog.color)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const beachTexture = new THREE.TextureLoader().load(
  "textures/beach.jpg",
  function (beachTexture) {
    beachTexture.wrapS = beachTexture.wrapT = THREE.RepeatWrapping
    beachTexture.repeat.set(18, 18)
  }
)
const beachSurface = new THREE.Mesh(
  new THREE.CircleGeometry(170, 32),
  new THREE.MeshBasicMaterial({ map: beachTexture })
)
// beachSurface.rotation.z = 30;
beachSurface.rotation.x = 260 * (Math.PI / 180)
beachSurface.position.y = -40
scene.add(beachSurface)

const hulahoopTexture = new THREE.TextureLoader().load(
  "textures/yellow_red_stripes.jpeg",
  function (hulahoopTexture) {
    hulahoopTexture.wrapS = hulahoopTexture.wrapT = THREE.RepeatWrapping
    hulahoopTexture.repeat.set(8, 0.3)
  }
)
const hulahoop = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.3, 16, 100),
  new THREE.MeshBasicMaterial({ map: hulahoopTexture })
)
hulahoop.position.x = 7
hulahoop.position.z = -10
// hulahoop.rotation.x = 30;
scene.add(hulahoop)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// const pointlightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointlightHelper, gridHelper);
// const gridHelper = new THREE.GridHelper(200,50);
// scene.add(gridHelper);

//This will listen to Dom events on the mouse and update the camera position accordingly
//we then need to call controls.update() in the game loop (animation loop)

//dit moet weer aangezet worden
const controls = new OrbitControls(camera, renderer.domElement)

var bubbles = []
function createBubbles() {
  var bubble, geoBubble, material
  for (var zpos = -100; zpos < 75; zpos += 3) {
    geoBubble = new THREE.SphereGeometry(1, 50, 50)
    material = new THREE.MeshPhongMaterial({
      color: 0x42f5cb,
      opacity: 0.9,
    })
    bubble = new THREE.Mesh(geoBubble, material)
    bubble.position.x = Math.random() * 150 - Math.random() * 150
    bubble.position.y = Math.random() * 200 - 30
    bubble.position.z = zpos
    scene.add(bubble)
    bubbles.push(bubble)
  }
}

function updateBubbles() {
  //iterate through every bubble
  var bubble
  var increment
  for (var i = 0; i < bubbles.length; i++) {
    bubble = bubbles[i]
    //move it upwards
    if (i % 3 === 0) {
      increment = 0.3
    } else if (i % 3 === 1) {
      increment = 0.6
    } else {
      increment = 2
    }
    bubble.position.y += increment
    if (bubble.position.y > 75) bubble.position.y = -200
  }
}
createBubbles()

const spaceTexture = new THREE.TextureLoader().load(
  "textures/underwater_wallpaper.jpeg"
)
scene.background = spaceTexture

//roosCube
const roosTexture = new THREE.TextureLoader().load(
  "images/IMG_20191005_040003__01.jpg"
)
const roosCube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: roosTexture })
)
roosCube.position.x = 7
roosCube.position.z = -10
scene.add(roosCube)

//worldSphere
const worldDayTexture = new THREE.TextureLoader().load(
  "textures/fish_texture.jpeg"
)
const worldNightTexture = new THREE.TextureLoader().load(
  "textures/2k_earth_nightmap.jpeg"
)
const sunTexture = new THREE.TextureLoader().load(
  "textures/fish_texture_pink.jpeg"
)
const moonTexture = new THREE.TextureLoader().load("textures/submarine.jpeg")
const normalTexture = new THREE.TextureLoader().load(
  "textures/2k_earth_normal_map.tif"
)
const worldSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: worldDayTexture,
  })
)
const moonSphere = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
  })
)
const sunSphere = new THREE.Mesh(
  new THREE.SphereGeometry(6, 32, 32),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
  })
)
worldSphere.position.z = 30
worldSphere.position.x = -10
moonSphere.position.z = 40
moonSphere.position.x = 10
moonSphere.position.y = 10
sunSphere.position.z = 100
sunSphere.position.x = -50
sunSphere.position.y = 15
scene.add(worldSphere, sunSphere, moonSphere)

// //FISHES
const textureParasect = new THREE.TextureLoader().load(
  "models/textures/Parasect_pm0047_00_BodyA1.png"
)
const materialParasect = new THREE.MeshPhongMaterial({
  map: textureParasect,
})
const loaderParasect = new OBJLoader()
loaderParasect.load(
  "models/Parasect.obj",
  function (objectParasect) {
    objectParasect.traverse(function (node) {
      if (node.isMesh) {
        node.material = materialParasect
      }
    })
    scene.add(objectParasect)
    objectParasect.rotation.x = 30 * (Math.PI / 180)
    objectParasect.position.x = 20
    objectParasect.position.z = 30
    objectParasect.position.y = 0
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  },
  function (error) {
    console.log("An error occurred")
  }
)

var shark
const textureShark = new THREE.TextureLoader().load(
  "models/textures/cartoon_shark.jpg"
)
const materialShark = new THREE.MeshPhongMaterial({
  map: textureShark,
})
const loaderShark = new OBJLoader()
loaderShark.load(
  "models/cartoon_shark.obj",
  function (objectShark) {
    objectShark.traverse(function (node) {
      if (node.isMesh) {
        node.material = materialShark
      }
    })
    shark = objectShark
    scene.add(objectShark)
    objectShark.rotation.x = 30 * (Math.PI / 180)
    objectShark.position.x = 50
    objectShark.position.z = 25
    objectShark.position.y = 3.5
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  },
  function (error) {
    console.log("An error occurred")
  }
)

function updateShark() {
  shark.position.x = 100 * Math.cos(t) + 50
  shark.position.z = 100 * Math.sin(t) + -50
  shark.rotation.y = shark.rotation.y - 0.5 * (Math.PI / 180)
}

function moveCamera() {
  //where is the user currently scrolled to? Get the view port.
  //Call the document body get boudning client rect
  //that will give us the dimensions of the viewport
  //the top porperty will show us how far we are from the top of the webpage
  //from there we can start changing properties on our 3d objects whenever this function is called
  const topValue = document.body.getBoundingClientRect().top
  worldSphere.rotation.x += 0.05
  worldSphere.rotation.y += 0.01
  worldSphere.rotation.z += 0.05
  worldSphere.position.y *= -topValue

  roosCube.rotation.y += 0.01
  roosCube.rotation.z += 0.01

  //the top value will always be negative so multiple it by a negative number
  if (topValue < 0) {
    camera.position.z = topValue * -0.02
    camera.position.x = topValue * -0.0004
    camera.position.y = topValue * -0.0002
  } else {
    camera.position.z = topValue * 0.02
    camera.position.x = topValue * 0.0004
    camera.position.y = topValue * 0.0002
  }
}
moveCamera()
document.body.onscroll = moveCamera

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener("resize", onWindowResize, false)

let t = 0
function animate() {
  requestAnimationFrame(animate)

  t += 0.01

  moonSphere.position.x = 20 * Math.cos(t) + 20
  moonSphere.position.z = 20 * Math.sin(t) + 10
  worldSphere.position.x = 50 * Math.cos(t) + 5
  worldSphere.position.z = 50 * Math.sin(t) + 10
  sunSphere.position.x = 5 * Math.cos(t) + -15
  sunSphere.position.y = 5 * Math.sin(t) + 0
  // objectShark.position.x = 70*Math.cos(t) + 0;
  // objectShark.position.y = 70*Math.sin(t) + 0;

  // hulahoop.rotation.x += 0.006;
  // hulahoop.rotation.y += 0.005;
  // hulahoop.rotation.z += 0.007;
  // hulahoop.position.x = 3*Math.cos(t) + 0;
  // hulahoop.position.z = 3*Math.sin(t) + 0;

  updateBubbles()
  updateShark()
  controls.update() //dit moet weer aangezet worden

  renderer.render(scene, camera)
}

animate()
