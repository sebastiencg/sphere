import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Sphere = () => {
  const mountRef = useRef(null);
  const [alphaValue, setAlphaValue] = useState(0);
  const [betaValue, setBetaValue] = useState(0);

  useEffect(() => {
    // Initialiser la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Charger une vidéo comme texture
    const video = document.createElement("video");
    video.src = "./src/assets/salle.mp4"; // Remplace par le chemin de ta vidéo
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    // Création d'une sphère avec la vidéo appliquée comme texture
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.BackSide,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    scene.rotation.y = -Math.PI / 10;

    scene.add(sphere);

    // Cube au centre de la scène
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Créer des groupes de caméra
    const cameraGroup = new THREE.Group();
    const verticalGroup = new THREE.Group();
    verticalGroup.add(camera);
    cameraGroup.add(verticalGroup);
    scene.add(cameraGroup);

    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, -5, 0)); // La caméra regarde plus bas (vers y = -2)

    let rotationX = 0;
    let rotationY = 0;

    // Gestion du gyroscope
    const handleOrientation = (event) => {
      const { alpha, beta } = event;

      // Normalisation des valeurs alpha et beta pour un contrôle fluide
      const normalizedAlpha = (alpha / 360) * (2 * Math.PI); // Rotation autour de Y (gauche-droite)
      let clampedBeta = Math.max(-80, Math.min(80, beta)); // Limite entre -80° et 80°
      const normalizedBeta = (clampedBeta / 90) * (Math.PI / 2); // Rotation autour de X (haut-bas)

      // Mettre à jour l'état pour afficher sur l'écran
      setAlphaValue(normalizedAlpha.toFixed(3));
      setBetaValue(normalizedBeta.toFixed(3));

      rotationY = normalizedAlpha;
      rotationX = normalizedBeta;
    };

    window.addEventListener("deviceorientation", handleOrientation);

    // Fonction d'animation
    const animate = () => {
      cameraGroup.rotation.y = rotationY;
      verticalGroup.rotation.x = rotationX;

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

    </>
  );
};

export default Sphere;
