import { type Metadata } from 'next'

export function getDefaultMetadata(metadata?: Metadata): Metadata {
  const { openGraph, twitter, ...rest } = metadata ?? {}

  return {
    title: 'L2BEAT - The state of the layer two ecosystem',
    description:
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    icons: [
      { rel: 'icon', url: '/favicon.svg' },
      { rel: 'shortcut icon', url: '/favicon.png' },
      { rel: 'apple-touch-icon', url: '/favicon.png' },
      { rel: 'mask-icon', url: '/mask-icon.svg' },
    ],
    metadataBase: new URL('https://l2beat.com'),
    openGraph: {
      type: 'website',
      siteName: 'L2BEAT',
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitter,
    },
    ...rest,
  }
}
