import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'hi', 'ta', 'ja', 'ko'],
    defaultLocale: 'en'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ta|hi|en|ja|ko)/:path*']
};
