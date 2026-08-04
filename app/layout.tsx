import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const euljiro = localFont({
  src: './fonts/BMEULJIROTTF.ttf',
  variable: '--font-hand',
  display: 'swap',
})

const yeonsung = localFont({
  src: './fonts/BMYEONSUNG.ttf',
  variable: '--font-yeonsung',
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
    <html
      lang="ko"
      className={`${euljiro.variable} ${yeonsung.variable} ${notoSansKr.variable}`}
    >
      <body className="font-sans">
        <div className="app-frame mx-auto min-h-screen w-full max-w-[500px] shadow-2xl sm:my-0">
          {children}
        </div>
      </body>
    </html>
  )
}
