import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Quizzy AI",
  description: "Learn any topic with fun",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
