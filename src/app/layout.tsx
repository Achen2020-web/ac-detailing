// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "AC Detailing & Cleaning",
  description: "Premium mobile detailing in Minneapolis — interior, exterior, coatings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning HERE too */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}