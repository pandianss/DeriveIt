'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface NumeralFormatterProps {
    value: number;
    style?: 'decimal' | 'currency' | 'percent';
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export default function NumeralFormatter({
    value,
    style = 'decimal',
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
}: NumeralFormatterProps) {
    const locale = useLocale();

    // Leverage Intl.NumberFormat for native cultural grouping rules
    // example: Indian (hi, ta) uses 12,34,567.89 (lakhs/crores)
    // example: Japanese/Korean (ja, ko) uses 1234,5678 (myriads)

    const formatter = new Intl.NumberFormat(locale, {
        style,
        currency,
        minimumFractionDigits,
        maximumFractionDigits
    });

    return (
        <span className="font-mono" suppressHydrationWarning>
            {formatter.format(value)}
        </span>
    );
}
