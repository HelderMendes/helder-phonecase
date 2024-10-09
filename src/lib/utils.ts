import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Metadata } from 'next';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  });

  return formatter.format(price);
};

export function constructMetadata({
  // title: "HelderCobra"
  title = 'HelderCobra custom hight-quality phone cases',
  description = 'Create custom hight-quality phone cases in seconds',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@cmhelder',
    },
    icons,
    metadataBase: new URL('https://helder-phonecase.vercel.app/'),
  };
}
