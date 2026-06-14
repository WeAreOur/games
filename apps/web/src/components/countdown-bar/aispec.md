# Countdown Bar Component

```
Feature: CountdownBar {
  What:
    - "Display visual progress bar for timed countdown"
    - "Manage internal timer state"
    - "Emit onTimeout callback when time expires"
    - "Provide pause and reset trigger functions"

  Boundaries:
    - "Default duration: 30000ms (30 seconds)"
    - "Bar width represents remaining time (100% = full duration)"
    - "Bar width position: absolute at top of container"
    - "Height: 2px with gradient background"
    - "Updates every 50ms"
    - "Fires onTimeout when percent reaches 0"
    - "triggerTimeoutPause() pauses the countdown"
    - "triggerTimeoutReset() resets and restarts countdown"

  Success:
    - "Bar width animates from 100% to 0%"
    - "Timeout fires after specified duration"
    - "Pause stops the countdown animation"
    - "Reset clears elapsed time and restarts from 100%"
    - "Bar visible above parent container content"
}
```
