# GeoNet 3D

GeoNet 3D is an interactive 3D visualization of the Solar System built with **Three.js**. The project was created as an immersive way to explore modern web-based 3D graphics while presenting planets, moons, artificial satellites, and astronomical simulations in an intuitive, space-themed environment.

## Live Demo

🌐 **Website:** [https://m15dev.github.io/GeoNet-3D/](https://m15dev.github.io/GeoNet-3D/)

---

## Features

* **Interactive Welcome Screen (Intro):** A dedicated, standalone 3D Earth globe preview rendered alongside a styled control guide before launching the full simulation.
* **Interactive 3D Solar System:** Explore celestial bodies rendered with real-time lighting and texture mapping.
* **Planetary Orbital Motion:** Dynamic orbital calculation for planets and Earth's Moon with independent orbits.
* **Artificial Satellites:** Track real-time satellite models orbiting Earth.
* **Real Speed Mode:** Synchronize astronomical positions based on the current UTC date and time.
* **3D Compass & Orientation:** Custom scissor-rendered 3D orientation compass overlaid on screen.
* **Planet Information & Navigation:** Dynamic panels providing physical and orbital parameters for selected celestial bodies.
* **Free & Locked Camera Controls:** Smooth camera transitions, tracking locks, and manual navigation.
* **Sci-Fi UI Experience:** Semi-transparent futuristic control panels with custom toggle options.

---

## Controls

### Mouse Controls
* **Left Click:** Select planets or satellites.
* **Right Click + Drag:** Rotate / Orbit camera around selected targets.
* **Scroll Wheel:** Zoom camera in / out.

### Keyboard Controls
* **W / A / S / D:** Free camera movement through 3D space.

---

## System UI & Settings

The system overlay allows you to:
* Toggle **Real Speed** vs. accelerated simulation speed.
* Toggle visibility for **Stars**, **Orbits**, **Artificial Satellites**, and the **3D Compass**.
* Lock camera tracking to specific planets.
* Cycle through planets using previous/next selectors.
* Inspect real-time 3D camera coordinates $(X, Y, Z)$.
* Hide/Show UI completely for clean views.

---

## Technologies Used

* **HTML5**
* **CSS3** (Custom Sci-Fi styles, backdrop filters, dot grid background)
* **JavaScript** (ES6 Modules)
* **Three.js** (WebGL 3D Rendering Engine)

---

## Project Structure

```text
GeoNet-3D/
├── index.html
├── main-style.css
├── app.js
├── scene.js
├── planets.js
├── satellites.js
├── orbits.js
├── camera.js
├── astronomy.js
├── navigation.js
├── ui.js
├── compass.js
├── lighting.js
└── textures/