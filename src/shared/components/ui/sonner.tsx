"use client"

import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Reads data-theme from <html> to match the design system's theming convention.
// Avoids next-themes dependency — theme is owned by data-theme, not a context.
function useDataTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const html = document.documentElement
    const read = () =>
      setTheme(html.getAttribute("data-theme") === "dark" ? "dark" : "light")

    read()
    const observer = new MutationObserver(read)
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  return theme
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDataTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info:    <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error:   <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
