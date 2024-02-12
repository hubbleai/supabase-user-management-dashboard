import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import InjectOrgs from "@/components/InjectOrgs";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CarbonAI: Customer Portal",
  description: "Admin console for CarbonAI customers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body className='text-zinc-700'>
        <main className='min-h-screen flex flex-col items-center'>
          <Navbar />
          <InjectOrgs />
          {children}
          <Footer />
          <Toaster />
        </main>
      </body>
    </html>
  );
}
