import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "active" | "inactive" | "ministry" | "default"
  size?: "sm" | "md"
  className?: string
}

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full border"

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  }

  const variantClasses = {
    active: "badge-active",
    inactive: "badge-inactive",
    ministry: "badge-ministry",
    default: "bg-gray-700 text-gray-300 border-gray-600",
  }

  return <span className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}>{children}</span>
}
