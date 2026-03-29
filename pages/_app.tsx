import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const useV2Font = process.env.NEXT_PUBLIC_USE_V2_FONT === 'true'

  return (
    <div
      className={`font-body-theme ${
        useV2Font ? 'font-theme-v2' : 'font-theme-default'
      }`}
    >
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
