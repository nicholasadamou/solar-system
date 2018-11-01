(function () {
    let global = this;

    let THREE = global.THREE,
        requestAnimationFrame = global.requestAnimationFrame;

    let renderer, scene, camera, controls, light, material, geometry, radians;
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
        material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/milky-way.jpg'),
            side: THREE.DoubleSide
        });
        geometry = new THREE.SphereGeometry(milkyWaySize, 35, 35);
        milkyWay = new THREE.Mesh(geometry, material);
        scene.add(milkyWay);

        //the Sun
        material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/sun.jpg'),
            side: THREE.DoubleSide
        });
        geometry = new THREE.SphereGeometry(sunSize, 35, 35);
        theSun = new THREE.Mesh(geometry, material);
        scene.add(theSun);

        //Mercury
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/mercury.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(mercurySize, 15, 15);
        mercury = new THREE.Mesh(geometry, material);
        scene.add(mercury);

        //Venus
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/venus.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(venusSize, 15, 15);
        venus = new THREE.Mesh(geometry, material);
        scene.add(venus);

        //Earth
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/earth.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(earthSize, 15, 15);
        earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        //Mars
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/mars.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(marsSize, 15, 15);
        mars = new THREE.Mesh(geometry, material);
        scene.add(mars);

        //Asteroid Belt
        asteroidBelt = new THREE.Object3D();
        scene.add(asteroidBelt);

        for(let x = 0; x < 3000; x++) {
            let asteroidSize = getRandomNumber(0.005, 0.5),
                asteroidOrbit = getRandomNumber(asteroidOrbitStart, asteroidOrbitEnd),
                yPos = getRandomNumber(-2, 2);

            geometry = new THREE.SphereGeometry(
                asteroidSize,
                getRandomNumber(4, 10),
                getRandomNumber(4, 10));
            material = new THREE.MeshLambertMaterial({color:0xeeeeee});
            asteroid = new THREE.Mesh(geometry, material);

            asteroid.position.y = yPos;
            radians = getRandomNumber(0, 360) * Math.PI / 180;
            asteroid.position.x = Math.cos(radians) * asteroidOrbit;
            asteroid.position.z = Math.sin(radians) * asteroidOrbit;

            asteroidBelt.add(asteroid);
        }

        //Jupiter
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/jupiter.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(jupiterSize, 25, 25);
        jupiter = new THREE.Mesh(geometry, material);
        scene.add(jupiter);

        //Saturn
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/saturn.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(saturnSize, 25, 25);
        saturn = new THREE.Mesh(geometry, material);
        scene.add(saturn);
        //Saturn's rings
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/saturn-ring.jpg'),
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide
        });
        geometry = new THREE.RingGeometry(saturnRingStart, saturnRingEnd, 30);
        saturnRing = new THREE.Mesh(geometry, material);
        saturn.add(saturnRing);
        saturnRing.rotation.x = 90 * Math.PI / 180;

        //Uranus
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/uranus.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(uranusSize, 20, 20);
        uranus = new THREE.Mesh(geometry, material);
        scene.add(uranus);
        //Uranus's rings
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/uranus-ring.png'),
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide,
            transparent: true
        });
        geometry = new THREE.RingGeometry(uranusRingStart, uranusRingEnd, 30);
        uranusRing = new THREE.Mesh(geometry, material);
        uranus.add(uranusRing);
        //Uranus' wierd positioning
        radians = 0 * Math.PI / 180;
        uranus.position.x = Math.cos(radians) * uranusOrbitRadius;
        uranus.position.z = Math.sin(radians) * uranusOrbitRadius;
        uranusRing.rotation.x = 90 * Math.PI / 180;
        uranus.rotation.z = 90 * Math.PI / 180;

        //Neptune
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('assets/images/neptune.jpg'),
            shading: THREE.SmoothShading
        });
        geometry = new THREE.SphereGeometry(neptuneSize, 20, 20);
        neptune = new THREE.Mesh(geometry, material);
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

    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

}).call(this);