# GeoNet 3D

GeoNet 3D is an interactive 3D visualization of the Solar System built with **Three.js**. The project was created as an immersive way to explore modern web-based 3D graphics while presenting planets, moons, artificial satellites, and astronomical simulations in an intuitive, space-themed environment.

## Development Note - AI Usage

GeoNet 3D was also a learning project. When I started it, I had very little experience with JavaScript because my classes ended before we covered it in depth. I was already comfortable with HTML and CSS, but Three.js and 3D programming were completely new to me.

Because of this, I used AI as a learning and development assistant to understand JavaScript concepts, learn the Three.js API, debug issues, and accelerate development while learning.

The project ideia, feature planning, UI design, testing, system integration, deployment, and final implementation decisions were all made by me. AI-generated code was reviewed, modified, tested, and integrated into the project by me.

This README was also written with AI assistance and then reviewed and edited by me.

---

## Live Demo

🌐 **Website:** https://m15dev.github.io/GeoNet-3D/

---

## Features

- **Interactive Welcome Screen (Intro):** A standalone 3D Earth preview rendered alongside a control guide before launching the full simulation.
- **Interactive 3D Solar System:** Explore celestial bodies rendered with real-time lighting and texture mapping.
- **Planetary Orbital Motion:** Dynamic orbital calculations for the planets and Earth's Moon.
- **Artificial Satellites:** View detailed 3D models of major artificial satellites orbiting Earth.
- **Real Speed Mode:** Synchronize astronomical positions with the current UTC date and time.
- **3D Compass & Orientation:** Custom scissor-rendered 3D orientation compass.
- **Planet Information & Navigation:** Dynamic information panels for celestial bodies.
- **Free & Locked Camera Controls:** Smooth camera transitions, target locking, and free-flight navigation.
- **Sci-Fi UI Experience:** Futuristic semi-transparent interface with multiple visualization options.

---

## Controls

> **Note:** GeoNet 3D is designed for desktop browsers. Mobile devices are currently not fully supported.

### Mouse

- **Left Click:** Select planets or satellites.
- **Right Click + Drag:** Orbit the camera around the selected object.
- **Mouse Wheel:** Zoom in and out.

### Keyboard

- **W / A / S / D:** Move the camera in Free Camera mode.
- **Shift:** Increase movement speed.
- **Arrow Keys:** Also move the camera in Free Camera mode.

When using **Free Camera**, pressing any movement key automatically unlocks the camera from the currently selected planet.

---

## System UI & Settings

The control panel allows you to:

- Toggle **Real Speed** mode.
- Show or hide **Stars**, **Orbits**, **Artificial Satellites**, and the **3D Compass**.
- Lock the camera to different planets.
- Navigate between planets using Previous/Next buttons.
- View the current 3D camera coordinates.
- Hide the interface for a clean cinematic view.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Three.js