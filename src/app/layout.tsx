import "./styles/globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Nunito_Sans } from "next/font/google";

// ✅ Premium & Professional Font
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Regular, Semi-bold, Bold
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
