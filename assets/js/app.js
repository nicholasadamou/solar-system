let global = this;

let requestAnimationFrame = global.requestAnimationFrame;

let renderer, scene, camera, controls, light, radians;
let mouse = new THREE.Vector2();

let milkyWay, theSun, asteroidBelt, asteroid, saturnRing, uranusRing;

// planet/sun size = 100,000km : 50 units
//      - The Sun is ~696342km, r = sunSize = 348.15,
// AU = 150 mil km : 50 units
// planet orbital radius = 1AU : 1AU
//      - Mercury is 0.4AU from the Sun, thus
//      planets.mercury.orbitalRadius = sunSize + (AU * 0.4)
// planet orbit speed = 1km : 0.02 units

let AU = 50;

let milkyWaySize = 15000;

let sunSize = 348.15;

let planets = {
    mercury: {
        size: 1.2,
        orbitalRadius: sunSize + (AU * 0.4),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.8,
        rotationSpeed: 0.05,
        meshSize: 15,
    },
    venus: {
        size: 3,
        orbitalRadius: sunSize + (AU * 0.7),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.7,
        rotationSpeed: -0.05,
        meshSize: 15,
    },
    earth: {
        size: 3,
        orbitalRadius: sunSize + AU,
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.6,
        rotationSpeed: 0.05,
        meshSize: 15,
    },
    mars: {
        size: 1.6,
        orbitalRadius: sunSize + (AU * 1.5),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.48,
        rotationSpeed: 0.05,
        meshSize: 15,
    },
    jupiter: {
        size: 34.99,
        orbitalRadius: sunSize + (AU * 5.2),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.26,
        rotationSpeed: 0.05,
        meshSize: 25,
    },
    saturn: {
        size: 29.1,
        orbitalRadius: sunSize + (AU * 9.5),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.18,
        rotationSpeed: 0.05,
        meshSize: 25,
    },
    uranus: {
        size: 12.7,
        orbitalRadius: sunSize + (AU * 19.2),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.14,
        rotationSpeed: -0.05,
        meshSize: 20,
      rotationAxis: 'x',
    },
    neptune: {
        size: 12.3,
        orbitalRadius: sunSize + (AU * 30.1),
        angle: getRandomNumber(0, 360),
        orbitalSpeed: 0.1,
        rotationSpeed: 0.05,
        meshSize: 20,
    },
};

let asteroidOrbitStart = sunSize + (AU * 2.3),
    asteroidOrbitEnd = sunSize + (AU * 3.3);

let saturnRingStart = planets.saturn.size + 3.3,
    saturnRingEnd = planets.saturn.size + 60;

let uranusRingStart = planets.uranus.size + 3,
    uranusRingEnd = planets.uranus.size + 40;

let WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

init();
animate();

function createBasicMesh(filePath = '', radius, size) {
    let geometry = new THREE.SphereGeometry(radius, size, size);
    let material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(filePath),
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
}

function createLambertMesh(filePath = '', radius, size) {
    let geometry = new THREE.SphereGeometry(radius, size, size);
    let material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture(filePath),
        shading: THREE.SmoothShading
    });
    return new THREE.Mesh(geometry, material);
}

function createRingMesh(filePath = '', transparent, start, end, size) {
    let geometry = new THREE.RingGeometry(start, end, size);
    let material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture(filePath),
        shading: THREE.SmoothShading,
        side: THREE.DoubleSide,
        transparent
    });
    return new THREE.Mesh(geometry, material);
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00008);

    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 100000);
    camera.position.z = 2000;

    controls = new THREE.TrackballControls(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    //ambient light
    scene.add(new THREE.AmbientLight(0x222222));

    //sunlight
    light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 0);
    scene.add(light);

    //the Milky Way
    milkyWay = createBasicMesh('assets/images/milky-way.jpg', milkyWaySize, 35);
    scene.add(milkyWay);

    //the Sun
    theSun = createBasicMesh('assets/images/sun.jpg', sunSize, 35);
    scene.add(theSun);

    //the planets
    for (var name in planets) {
        let data = planets[name];
        data.mesh = createLambertMesh(`assets/images/${ name }.jpg`, data.size, data.meshSize);
        scene.add(data.mesh)
    }

    //Asteroid Belt
    asteroidBelt = new THREE.Object3D();
    scene.add(asteroidBelt);

    for(let x = 0; x < 3000; x++) {
        let asteroidSize = getRandomNumber(0.005, 0.5),
            asteroidOrbit = getRandomNumber(asteroidOrbitStart, asteroidOrbitEnd),
            yPos = getRandomNumber(-2, 2);

        let geometry = new THREE.SphereGeometry(
            asteroidSize,
            getRandomNumber(4, 10),
            getRandomNumber(4, 10));
        let material = new THREE.MeshLambertMaterial({color:0xeeeeee});
        asteroid = new THREE.Mesh(geometry, material);

        asteroid.position.y = yPos;
        radians = getRandomNumber(0, 360) * Math.PI / 180;
        asteroid.position.x = Math.cos(radians) * asteroidOrbit;
        asteroid.position.z = Math.sin(radians) * asteroidOrbit;

        asteroidBelt.add(asteroid);
    }

    //Saturn's rings
    saturnRing = createRingMesh('assets/images/saturn-ring.jpg', false, saturnRingStart, saturnRingEnd, 30);
    planets.saturn.mesh.add(saturnRing);
    saturnRing.rotation.x = 90 * Math.PI / 180;

    //Uranus's rings
    uranusRing = createRingMesh('assets/images/uranus-ring.png', true, uranusRingStart, uranusRingEnd, 30);
    planets.uranus.mesh.add(uranusRing);

    //Uranus' weird positioning
    radians = 0 * Math.PI / 180;
    planets.uranus.mesh.position.x = Math.cos(radians) * planets.uranus.orbitalRadius;
    planets.uranus.mesh.position.z = Math.sin(radians) * planets.uranus.orbitalRadius;
    uranusRing.rotation.x = 90 * Math.PI / 180;
    planets.uranus.mesh.rotation.z = 90 * Math.PI / 180;

    window.addEventListener('resize', onWindowResize, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerWidth;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerWidth);
}

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    controls.update();

    theSun.rotation.y += 0.001;
    asteroidBelt.rotation.y += 0.0001;

    for (var name in planets) {
        let data = planets[name];
        let mesh = data.mesh;
        data.angle -= data.orbitalSpeed;
        let radians = data.angle * Math.PI / 180;

        mesh.position.x = Math.cos(radians) * data.orbitalRadius;
        mesh.position.z = Math.sin(radians) * data.orbitalRadius;
        mesh.rotation[data.rotationAxis || 'y'] += data.rotationSpeed;
    }

    renderer.render(scene, camera);
}
