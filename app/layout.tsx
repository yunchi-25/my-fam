import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import ClerkClientProvider from './clerk-client-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '나의 가족 이야기',
  description: '가족 사진과 추억을 기록하는 개인용 갤러리',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkClientProvider>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  )
}
