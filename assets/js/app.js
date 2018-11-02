(function () {
    let global = this;

    let THREE = global.THREE,
        requestAnimationFrame = global.requestAnimationFrame;

    let renderer, scene, camera, controls, light, radians;
    let mouse = new THREE.Vector2();

    let milkyWay, theSun, mercury, venus, earth, mars, asteroidBelt, asteroid, jupiter, saturn, saturnRing, uranus, neptune;

    // planet/sun size = 100,000km : 50 units (sun is ~696342km, r = sunSize = 348.15)
    // AU = 150 mil km : 50 units
    // planet orbital radius = 1AU : 1AU (mercury is 0.4AU from sun = sunSize + (AU * 0.4))
    // planet orbit speed = 1km : 0.02 units

    let AU = 50;

    let milkyWaySize = 15000;

    let sunSize = 348.15;

    let mercurySize = 1.2,
        mercuryOrbitRadius = sunSize + (AU * 0.4),
        mercuryOrbitAngle = getRandomNumber(0, 360),
        mercuryOrbitSpeed = 0.8,
        mercuryRotateSpeed = 0.05;

    let venusSize = 3,
        venusOrbitRadius = sunSize + (AU * 0.7),
        venusOrbitAngle = getRandomNumber(0, 360),
        venusOrbitSpeed = 0.7,
        venusRotateSpeed = 0.05;

    let earthSize = 3,
        earthOrbitRadius = sunSize + AU,
        earthOrbitAngle = getRandomNumber(0, 360),
        earthOrbitSpeed = 0.6,
        earthRotateSpeed = 0.05;

    let marsSize = 1.6,
        marsOrbitRadius = sunSize + (AU * 1.5),
        marsOrbitAngle = getRandomNumber(0, 360),
        marsOrbitSpeed = 0.48,
        marsRotateSpeed = 0.05;

    let asteroidOrbitStart = sunSize + (AU * 2.3),
        asteroidOrbitEnd = sunSize + (AU * 3.3);

    let jupiterSize = 34.99,
        jupiterOrbitRadius = sunSize + (AU * 5.2),
        jupiterOrbitAngle = getRandomNumber(0, 360),
        jupiterOrbitSpeed = 0.26,
        jupiterRotateSpeed = 0.05;

    let saturnSize = 29.1,
        saturnOrbitRadius = sunSize + (AU * 9.5),
        saturnOrbitAngle = getRandomNumber(0, 360),
        saturnOrbitSpeed = 0.18,
        saturnRotateSpeed = 0.05;

    let saturnRingStart = saturnSize + 3.3,
        saturnRingEnd = saturnSize + 60;

    let uranusSize = 12.7,
        uranusOrbitRadius = sunSize + (AU * 19.2),
        uranusOrbitAngle = getRandomNumber(0, 360),
        uranusOrbitSpeed = 0.14,
        uranusRotateSpeed = 0.05;

    let uranusRingStart = uranusSize + 3,
        uranusRingEnd = uranusSize + 40;

    let neptuneSize = 12.3,
        neptuneOrbitRadius = sunSize + (AU * 30.1),
        neptuneOrbitAngle = getRandomNumber(0, 360),
        neptuneOrbitSpeed = 0.1,
        neptuneRotateSpeed = 0.05;

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

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
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

        //Mercury
        mercury = createLambertMesh('assets/images/mercury.jpg', mercurySize, 15);
        scene.add(mercury);

        //Venus
        venus = createLambertMesh('assets/images/venus.jpg', venusSize, 15);
        scene.add(venus);

        //Earth
        earth = createLambertMesh('assets/images/earth.jpg', earthSize, 15);
        scene.add(earth);

        //Mars
        mars = createLambertMesh('assets/images/mars.jpg', marsSize, 15);
        scene.add(mars);

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

        //Jupiter
        jupiter = createLambertMesh('assets/images/jupiter.jpg', jupiterSize, 25);
        scene.add(jupiter);

        //Saturn
        saturn = createLambertMesh('assets/images/saturn.jpg', saturnSize, 25);
        scene.add(saturn);
        //Saturn's rings
        saturnRing = createRingMesh('assets/images/saturn-ring.jpg', false, saturnRingStart, saturnRingEnd, 30);
        saturn.add(saturnRing);
        saturnRing.rotation.x = 90 * Math.PI / 180;

        //Uranus
        uranus = createLambertMesh('assets/images/uranus.jpg', uranusSize, 20);
        scene.add(uranus);
        //Uranus's rings
        uranusRing = createRingMesh('assets/images/uranus-ring.png', true, uranusRingStart, uranusRingEnd, 30);
        uranus.add(uranusRing);
        //Uranus' wierd positioning
        radians = 0 * Math.PI / 180;
        uranus.position.x = Math.cos(radians) * uranusOrbitRadius;
        uranus.position.z = Math.sin(radians) * uranusOrbitRadius;
        uranusRing.rotation.x = 90 * Math.PI / 180;
        uranus.rotation.z = 90 * Math.PI / 180;

        //Neptune
        neptune = createLambertMesh('assets/images/neptune.jpg', neptuneSize, 20);
        scene.add(neptune);

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

        //run Mercury's orbit around the Sun
        mercuryOrbitAngle -= mercuryOrbitSpeed;
        radians = mercuryOrbitAngle * Math.PI / 180;
        mercury.position.x = Math.cos(radians) * mercuryOrbitRadius;
        mercury.position.z = Math.sin(radians) * mercuryOrbitRadius;
        mercury.rotation.y += mercuryRotateSpeed;

        //run Venus's orbit around the Sun
        venusOrbitAngle -= venusOrbitSpeed;
        radians = venusOrbitAngle * Math.PI / 180;
        venus.position.x = Math.cos(radians) * venusOrbitRadius;
        venus.position.z = Math.sin(radians) * venusOrbitRadius;
        venus.rotation.y -= venusRotateSpeed;

        //run Earth's orbit around the Sun
        earthOrbitAngle -= earthOrbitSpeed;
        radians = earthOrbitAngle * Math.PI / 180;
        earth.position.x = Math.cos(radians) * earthOrbitRadius;
        earth.position.z = Math.sin(radians) * earthOrbitRadius;
        earth.rotation.y += earthRotateSpeed;

        //run Mars's orbit around the Sun
        marsOrbitAngle -= marsOrbitSpeed;
        radians = marsOrbitAngle * Math.PI / 180;
        mars.position.x = Math.cos(radians) * marsOrbitRadius;
        mars.position.z = Math.sin(radians) * marsOrbitRadius;
        mars.rotation.y += marsRotateSpeed;

        //run Jupiter's orbit around the Sun
        jupiterOrbitAngle -= jupiterOrbitSpeed;
        radians = jupiterOrbitAngle * Math.PI / 180;
        jupiter.position.x = Math.cos(radians) * jupiterOrbitRadius;
        jupiter.position.z = Math.sin(radians) * jupiterOrbitRadius;
        jupiter.rotation.y += jupiterRotateSpeed;

        //run Saturn's orbit around the Sun
        saturnOrbitAngle -= saturnOrbitSpeed;
        radians = saturnOrbitAngle * Math.PI / 180;
        saturn.position.x = Math.cos(radians) * saturnOrbitRadius;
        saturn.position.z = Math.sin(radians) * saturnOrbitRadius;
        saturn.rotation.y += saturnRotateSpeed;

        //run Uranus's orbit around the Sun
        uranusOrbitAngle -= uranusOrbitSpeed;
        radians = uranusOrbitAngle * Math.PI / 180;
        uranus.position.x = Math.cos(radians) * uranusOrbitRadius;
        uranus.position.z = Math.sin(radians) * uranusOrbitRadius;
        uranus.rotation.x -= uranusRotateSpeed;

        //run Neptune's orbit around the Sun
        neptuneOrbitAngle -= neptuneOrbitSpeed;
        radians = neptuneOrbitAngle * Math.PI / 180;
        neptune.position.x = Math.cos(radians) * neptuneOrbitRadius;
        neptune.position.z = Math.sin(radians) * neptuneOrbitRadius;
        neptune.rotation.y += neptuneRotateSpeed;

        renderer.render(scene, camera);
    }
}).call(this);
