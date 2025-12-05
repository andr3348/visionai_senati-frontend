import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { AuthProvider } from "@/contexts/auth.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisionAI",
  description: "Your DL-powered online model to predict human emotions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* AuthProvide to check current authenticated user status */}
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <QueryProvider>
              <div className="flex flex-col min-h-screen w-full">
                <header className="flex items-center gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger />
                  {/* Path text will go here */}
                </header>
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            </QueryProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
