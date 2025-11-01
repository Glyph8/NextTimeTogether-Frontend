"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// type ToasterProps = React.ComponentProps<typeof Sonner>

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  nonce?: string; // nonce prop 추가
}

const Toaster = ({ nonce, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group bg-black"
      offset={80}
      mobileOffset={80}     
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
