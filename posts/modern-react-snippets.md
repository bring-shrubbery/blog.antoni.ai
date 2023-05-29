---
title: Modern and Useful React Snippets
publish_date: 2023-05-29
---

## TailwindCSS type-safe component

```tsx
import { cn } from "@/lib/cn"

interface MyComponentProps extends ComponentProps<"div"> {
  // Custom props go here
}

const MyComponent = ({ className, ...props }: React.PropsWithChildren<MyComponentProps>) => {
  return <div className={cn("", className)} {...props}>
    {children}
  </div>
}

export { MyComponent, type MyComponentProps }
```
