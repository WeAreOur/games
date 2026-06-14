# Streak Bar Component

```
Feature: StreakBar {
  What:
    - "Display progress bar with filled/unfilled segments"
    - "Show current progress vs maximum"
    - "Display optional label text"
    - "Visually represent streak or level progress"

  Boundaries:
    - "Maximum number of segments cannot exceed 100"
    - "Current value must not exceed max"
    - "Segments rendered based on max prop"
    - "First 'current' segments marked as filled"
    - "Remaining segments marked as empty"
    - "Label displays above bar if provided"
    - "Default label is 'Progress'"
    - "Filled segments use class 'filled'"
    - "Empty segments use class 'unfilled' or no class"

  Success:
    - "Correct number of segments render"
    - "Correct number of segments are filled"
    - "Label displays above bar"
    - "Visual distance between segments"
    - "Segments clearly distinguish filled/unfilled"
}
```
