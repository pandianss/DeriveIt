import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'hi', 'ta', 'ja', 'ko'];

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale as any)) notFound();

    return {
        locale: locale || 'en',
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
