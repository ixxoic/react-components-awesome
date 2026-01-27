"use client"

import * as React from "react"
import { cn } from "@/examples/base/lib/utils"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

const Separator = React.forwardRef(({
  className,
  orientation = "horizontal",
  ...props
}, ref) => {
  return (
    <SeparatorPrimitive
      ref={ref}
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
})
Separator.displayName = "Separator"

export { Separator }