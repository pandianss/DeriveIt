import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

const locales = ['en', 'hi', 'ta', 'ja', 'ko'];

export default getRequestConfig(async ({ requestLocale }) => {
    // In next-intl v4, locale comes from requestLocale
    const locale = await requestLocale;

    if (!locale || !hasLocale(locales, locale)) notFound();

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
