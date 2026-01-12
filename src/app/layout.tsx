import { ReactNode } from "react";

export const metadata = {
  title: "Kanban App",
  description: "Simple Kanban board with timestamps",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
