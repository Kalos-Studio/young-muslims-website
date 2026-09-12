import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { FooterSlot } from "@/components/site/footer-slot";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
// WIREFRAME: the two imports below are prototype scaffolding. See WIREFRAME.md.
import { AnnotationToolbar } from "@/components/wireframe/annotation-toolbar";
import { NotesToggle } from "@/components/wireframe/notes-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // `template` keeps the site name out of every page's own title, so the
  // separator is defined once here rather than retyped in seven files.
  title: {
    default: "Young Muslims",
    template: "%s | Young Muslims",
  },
  description: "Young Muslims' official website.",
  // WIREFRAME: the whole site is a wireframe right now, so none of it should be
  // indexed. Remove when there is real content to find.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <FooterSlot>
          <SiteFooter />
        </FooterSlot>
        {/* WIREFRAME: both come out with the wireframe; the header and footer
            above them stay. */}
        <NotesToggle />
        <AnnotationToolbar />
      </body>
    </html>
  );
}
