import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farmácia Popular",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <nav>
        
            <Link href={"/"}>Início</Link>
            <Link href={"/estados"}>Estados</Link>
            <Link href={"/cidades"}>Cidades</Link>
       
          </nav>
         <h1>PROGRAMA FARMÁCIA POPULAR </h1>
         <img src="https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular/farmacia-popular/@@govbr.institucional.banner/bca7c06c-0f14-4b22-a7be-2a8681349d7c/@@images/4963ae29-c373-4128-8371-8400cff572bc.png" alt="imagem"  className="imagem1"/>
        {children}
        <img src="/footer.png" alt="imagem" className="imagem1"
          
        />
      </body>
    </html>
  );
}
