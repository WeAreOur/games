# Sum Game Component

```
Feature: SumGame {
  What:
    - "Orchestrate main game flow and state management"
    - "Initialize and manage game state using createSumGame"
    - "Display math problems with missing values"
    - "Accept numeric input via numpad (0-9)"
    - "Track score, streak, and level"
    - "Compose CountdownBar, History, Numpad, ProblemDisplay components"
    - "Show confetti on correct answer"
    - "Show toast notifications for feedback"
    - "Support keyboard input (digits, Backspace for backspace, Escape to skip)"

  Boundaries:
    - "Correct answer: +10 * level points"
    - "Wrong answer: -5 * level points"
    - "Skip answer: -5 * level points"
    - "Streak resets on wrong/skip"
    - "Level up: streak > 10 AND response < 30s"
    - "Streak resets when leveling up"
    - "Timeout triggers skip via CountdownBar.onTimeout callback"
    - "Uses triggerTimeoutPause() on answer submit"
    - "Uses triggerTimeoutReset() on new problem load"
    - "Uses pushToGameHistory() to record answers"
    - "Uses clearGameHistory() on restart"
    - "Storage via IndexedDbAdapter"
    - "Keyboard: 0-9 for digit, Backspace for delete, Escape for skip"

  Success:
    - "Game initializes with level 1"
    - "Problems display with ? for missing value"
    - "User input builds answer correctly"
    - "Score/streak/level update correctly"
    - "Confetti triggers on correct"
    - "Toasts show success/error/info"
    - "History records all attempts"
    - "Restart clears game and history"
    - "Countdown manages timeouts"
    - "Keyboard controls responsive"
}
```

