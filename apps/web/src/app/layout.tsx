import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juventude",
  description: "Sistema de gestão da Juventude da Missão Praia da Costa",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-dark-primary text-light-gray antialiased`}>
        <div className="min-h-screen">
          <Navigation />
          <main className="pb-20 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  )
}
