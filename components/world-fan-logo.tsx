"use client"

import Image from "next/image"

interface WorldFanLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function WorldFanLogo({ size = 40, className = "", showText = true }: WorldFanLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/images/world-fan-logo-hq.png"
        alt="World Fan Logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && <span className="text-2xl font-bold text-black">World Fan</span>}
    </div>
  )
}
