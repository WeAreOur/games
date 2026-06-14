# Toast Component

```
Feature: ToastNotification {
  What:
    - "Display temporary notification messages"
    - "Support success, error, and info message types"
    - "Auto-dismiss notifications after duration"
    - "Stack multiple toasts vertically"
    - "Provide triggerToast() function for external control"
    - "Export ToastMessage interface"

  Boundaries:
    - "Default duration: 2000ms"
    - "Custom duration can be provided per message"
    - "Success messages styled with purple kid-friendly pastel"
    - "Error messages styled with pink kid-friendly pastel"
    - "Info messages styled with cyan kid-friendly pastel"
    - "Positioned fixed at top-center of viewport"
    - "z-index 1000 to appear above all content"
    - "Each toast has unique random ID"
    - "Toasts removed from DOM after animation completes"
    - "Animation: scaleIn 0.3s, stay 1.7s, scaleOut 0.3s"

  Success:
    - "Toast auto-dismisses after duration"
    - "Multiple toasts stack and animate"
    - "Message displays correctly"
    - "triggerToast() function works from any component"
    - "Default duration applied when not specified"
}
```
