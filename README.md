# Image Slider Library

Modular vanilla JavaScript image slider — built from scratch (no plugins).

## Features
- Previous / Next arrows on left/right edges
- Dynamic indicator dots (one per slide, active state, clickable)
- Horizontal sliding track animation (`transform: translateX()` + `transition`)
- Seamless infinite loop via first/last clones + `transitionend` jump
- Fully responsive (`overflow: hidden` viewport, `object-fit: cover`, fluid widths)
- Keyboard arrows + touch swipe support
- ES6 `ImageSlider` class

## Files
- `index.html` — container markup + sample images
- `style.css` — viewport mask, flex track, controls, transitions
- `slider.js` — slider logic

## Run
Open `index.html` in a browser, or:
```bash
npx serve .
```
