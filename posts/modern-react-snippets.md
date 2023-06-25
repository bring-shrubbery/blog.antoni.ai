---
title: Modern and Useful React Snippets
publish_date: 2023-05-29
---

## TailwindCSS type-safe component

> **TIP:** Select "MyComponent" in VSCode and press `cmd + d` several times to
> select all occurances of "MyComponent". Then type in the name of your
> component.

```tsx
import { cn } from "@/lib/utils";

interface MyComponentProps extends React.ComponentProps<"div"> {
  // Custom props go here
}

const MyComponent = ({
  className,
  children,
  ...props
}: React.PropsWithChildren<MyComponentProps>) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export { MyComponent, type MyComponentProps };
```
