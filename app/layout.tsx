import type { Metadata } from 'next'
import { Black_Han_Sans, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const blackHanSans = Black_Han_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-hand',
  display: 'swap',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '오늘은 배달이다!',
  description: '나만의 배달 맛집 기록 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${blackHanSans.variable} ${notoSansKr.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
