import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://shopmong.vercel.app"),
  title: "샵몽 | 쇼핑몰 이미지 규격 변환",
  description:
    "네이버 스마트스토어, 쿠팡, 11번가, G마켓·옥션 등 쇼핑몰 플랫폼에 맞게 상품 이미지를 간편하게 변환해보세요.",
  keywords: [
    "샵몽",
    "쇼핑몰 이미지 변환",
    "상품 이미지 변환",
    "스마트스토어 이미지",
    "쿠팡 이미지",
    "11번가 이미지",
    "상품 이미지 사이즈",
  ],
  alternates: {
    canonical: "https://shopmong.vercel.app",
  },
  openGraph: {
    title: "샵몽 | 쇼핑몰 이미지 규격 변환",
    description:
      "쇼핑몰 플랫폼별 상품 이미지 규격에 맞게 이미지를 간편하게 변환해보세요.",
    url: "https://shopmong.vercel.app",
    siteName: "샵몽",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
