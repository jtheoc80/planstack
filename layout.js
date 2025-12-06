import './globals.css'

export const metadata = {
  title: 'PlanStack | Construction Takeoff Platform',
  description: 'AI-Powered Construction Takeoff for Hotels & Multi-Family Buildings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
