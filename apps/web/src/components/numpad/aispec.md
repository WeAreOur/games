# Numpad Component

```
Feature: NumpadInput {
  What:
    - "Display numeric keypad for digit input (0-9)"
    - "Render buttons in 3x3 grid layout"
    - "Call onDigit callback when digit buttons clicked"
    - "Pass digit string to handler"

  Boundaries:
    - "Must display all 10 digits (1-9, 0)"
    - "Layout: 3 columns, digits 1-9 in order, then 0"
    - "Each digit button calls onDigit with digit string"
    - "All buttons have CSS class 'numpad-btn'"
    - "Grid gap 8px, padding 20px"
    - "Button hover effect: purple background, white text, slight upward movement"
    - "Button active effect: returns to base position"

  Success:
    - "All 10 digits render in 3x3 grid"
    - "Clicking any digit calls onDigit with correct digit"
    - "Hover state provides visual feedback"
    - "Active state provides click feedback"
    - "Grid layout is properly aligned"
}
```
