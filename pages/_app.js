import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'

import '../styles/tailwind.css'
import '../styles/app.css'

import { isBrowser } from '@lib/helpers'

import { SiteContextProvider } from '@lib/context'

import Cart from '@components/cart'

// Console Credits
if (isBrowser) {
  console.groupCollapsed(
    '%c💀 Site Credits',
    'display:block;padding:0.125em 1em;font-family:courier;font-size:14px;font-weight:bold;line-height:2;text-transform:uppercase;background:black;color:white;'
  )
  console.log(
    '%cDesign by Nick DiMatteo \n– https://nickdimatteo.com',
    'display:block;font-family:courier;font-size:12px;font-weight:bold;line-height:1;color:black;'
  )
  console.log(
    '%cWeb Development by Nick DiMatteo \n– https://nickdimatteo.com',
    'display:block;font-family:courier;font-size:12px;font-weight:bold;line-height:1;color:black;'
  )
  console.groupEnd()
}

const MyApp = ({ Component, pageProps, router }) => {
  const [isLoading, setLoading] = useState(false)

  // The scroll location on the page is not restored on history changes
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [router])

  // Trigger our loading class
  useEffect(() => {
    if (isBrowser) {
      document.documentElement.classList.toggle('is-loading', isLoading)
    }
  }, [isLoading])

  // Setup Next router events
  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      // Bail if we're just changing a URL parameter
      if (
        url.indexOf('?') > -1 &&
        url.split('?')[0] === router.asPath.split('?')[0]
      )
        return

      // Otherwise, start loading
      setLoading(true)
    })

    Router.events.on('routeChangeComplete', (url) => {
      setTimeout(() => setLoading(false), 400) // accounts for page transition time
    })

    Router.events.on('routeChangeError', () => {
      setLoading(false)
    })
  }, [])

  // intelligently add focus states if keyboard is used
  const handleFirstTab = (event) => {
    if (event.keyCode === 9) {
      if (isBrowser) {
        document.body.classList.add('is-tabbing')
        window.removeEventListener('keydown', handleFirstTab)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleFirstTab)
    return () => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])

  return (
    <ThemeProvider enableSystem={false} disableTransitionOnChange>
      <SiteContextProvider data={{ ...pageProps?.data?.site }}>
        <LazyMotion features={domAnimation}>
          {isLoading && (
            <Head>
              <title>Loading...</title>
            </Head>
          )}
          <AnimatePresence
            exitBeforeEnter
            onExitComplete={() => {
              window.scrollTo(0, 0)
              document.body.classList.remove('overflow-hidden')
            }}
          >
            <Component key={router.asPath.split('?')[0]} {...pageProps} />
          </AnimatePresence>

          <Cart data={{ ...pageProps?.data?.site }} />
        </LazyMotion>
      </SiteContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
