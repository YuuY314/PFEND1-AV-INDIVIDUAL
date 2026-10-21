import { Geist, Geist_Mono, Lato, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: "700",
})

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"]
});

export const metadata = {
  title: "Entrelinhas",
  description: "Livros & Boas Histórias",
};

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable} ${libreBaskerville.variable}`}>
      <body>
        <Header/>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
