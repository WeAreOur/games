# Confetti Component

```
Feature: ConfettiAnimation {
  What:
    - "Display particle-based confetti animation on canvas"
    - "Render animated falling particles with colors and gravity"
    - "Export trigger function for external control"
    - "Remove canvas from DOM when animation completes"

  Boundaries:
    - "Animation runs via requestAnimationFrame"
    - "Canvas positioned fixed at viewport size"
    - "50 particles per trigger event"
    - "Z-index 9999 to appear above all content"
    - "Particles have randomized velocity and decay"
    - "Pointer events disabled on canvas"

  Success:
    - "Confetti renders at full screen size"
    - "Particles fall smoothly with gravity simulation"
    - "Colors are random HSL values"
    - "Animation completes and canvas is cleaned up"
    - "triggerConfetti() function triggers animation event"
    - "Component can be rendered without visible elements"
}
```
