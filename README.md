# GeoNet 3D

GeoNet 3D is an interactive 3D visualization of the Solar System built with **Three.js**. The project was created as a way to explore modern web-based 3D graphics while presenting planets, moons, artificial satellites, and astronomical simulations in an intuitive environment.

## Live Demo

**Website:**
https://m15dev.github.io/GeoNet-3D/

---

## Features

* Interactive 3D Solar System
* Planetary orbital motion
* Earth's Moon with independent orbit
* Artificial satellites around Earth
* Real Speed mode based on the current UTC date and time
* Planet alignment animation
* Planet labels and information
* Free camera controls
* Responsive interface

---

## Controls

### Mouse

* **Left Click + Drag** → Rotate the camera
* **Mouse Wheel** → Zoom in/out
* **Right Click + Drag** → Move (Pan) the camera

### Interface

The interface allows you to:

* Toggle **Real Speed** mode
* Align all planets before synchronizing them with their calculated positions
* Enable or disable Earth's rotation
* Select planets
* Display information panels
* Control simulation settings

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6 Modules)
* Three.js

---

## Project Structure

```text
index.html
css/
js/
assets/
textures/
```

---

## About the Simulation

The project is **not intended to be a scientific simulator**.

Instead, it provides an educational and visually appealing representation of the Solar System.

The planetary orbits are simplified by assuming:

* Circular orbits
* Constant orbital velocity
* Fixed orbital planes

The Real Speed mode synchronizes orbital positions using the current UTC date while keeping these simplifications.

---

## Artificial Satellites

The project currently includes several well-known spacecraft such as:

* International Space Station (ISS)
* Hubble Space Telescope
* James Webb Space Telescope (JWST)
* Sentinel-2A
* Landsat 9

These satellites are represented using simplified orbital models suitable for visualization.

---

## AI Assistance

Artificial Intelligence was used extensively during the development of this project.

At the time this project was developed, I had already learned HTML and CSS, but my JavaScript knowledge was still limited because our classes had gone on vacation before we reached that part of the course.

Since Three.js is a considerably more advanced library, I decided to use AI as a development assistant to accelerate learning and implementation.

AI was mainly used for:

* Explaining JavaScript concepts
* Understanding Three.js APIs
* Generating initial code structures
* Debugging errors
* Suggesting mathematical approaches for orbital motion
* Refactoring code
* Improving project organization

All architectural decisions, feature selection, testing, debugging, and final integration were carried out by me. AI served as a programming assistant rather than an automatic project generator.

---

## Future Improvements

* More realistic orbital mechanics
* Better lighting and shadows
* Higher-quality planet textures
* More satellites
* Comets
* Spacecraft missions
* Improved UI/UX
* Performance optimizations

---

## Author

Developed by **M15DEV**

GitHub:
https://github.com/M15DEV

Project:
https://m15dev.github.io/GeoNet-3D/
