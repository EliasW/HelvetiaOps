import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default withAuth(
  function onSuccess(req: NextRequest) {
    return intlMiddleware(req);
  },
  
  {
    pages: {
      signIn: '/en/auth',
    },
  }
  
);

export const config = {
  matcher: [
    '/',
    '/(en|de)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)' 
  ]
};
