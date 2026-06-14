# Problem Display Component

```
Feature: ProblemDisplay {
  What:
    - "Display math equation with interactive styling"
    - "Highlight missing value with ? character"
    - "Highlight operators (+, -, *, /)"
    - "Highlight equals sign"
    - "Display user's current answer below equation"
    - "Support any equation string format"

  Boundaries:
    - "Missing value `_` gets class 'part-missing'"
    - "Operators get class 'part-operator'"
    - "Equals sign gets class 'part-equals'"
    - "Other characters get class 'part-default'"
    - "All characters wrapped in 'part' class span"
    - "Answer displays only if provided"
    - "Answer display uses class 'answer-display'"
    - "Equation container uses class 'equation'"

  Success:
    - "All characters render individually"
    - "Characters styled according to type"
    - "`_` highlighted as missing value"
    - "Operators visually distinct"
    - "Equals sign visually distinct"
    - "Answer displays correctly when provided"
    - "Answer hidden when not provided"
}
```
