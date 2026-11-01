import Script from 'next/script';

import './globals.css';
import type { Lang } from './copy';
import { schemaFor } from './schema';
import { TOODIP_SITE_ID } from './seo';

/**
 * Document shell shared by the PL and EN root layouts: <html lang>, JSON-LD
 * for the given language and the toodip stats script.
 */
export default function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const { business, faq, site } = schemaFor(lang);
  return (
    <html lang={lang}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
        {/* toodip stats: page views, conversions, AI referrals */}
        <Script src="https://stats.toodip.com/s.js" data-id={TOODIP_SITE_ID} strategy="afterInteractive" />
        {/* Microsoft Clarity: session recordings and heatmaps (project z6xuka0ka2) */}
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "z6xuka0ka2");
        `}</Script>
      </body>
    </html>
  );
}
