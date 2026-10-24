import type { Viewport } from 'next';

import Shell from '../Shell';
import { metadataFor } from '../seo';

export const metadata = metadataFor('pl');

export const viewport: Viewport = {
  themeColor: '#FAF7F0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return <Shell lang="pl">{children}</Shell>;
}
