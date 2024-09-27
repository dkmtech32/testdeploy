import Footer from '@/components/footer'
import Header from '@/components/header'
import HomePage from '@/components/home/home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'dkmtech'
}

export default function Home() {
  return <main>
    <Header/>

    <HomePage />
    <Footer/>
    </main>

}
