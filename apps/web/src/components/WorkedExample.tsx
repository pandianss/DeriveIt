'use client';

import React from 'react';
import MathRendererClient from './MathRendererClient';
import { useTranslations } from 'next-intl';

const MathRenderer = MathRendererClient;

interface WorkedExampleProps {
    problemTex: string;
    stepsTex: string[];
    solutionTex: string;
    masteryScore: number; // 0 to 100
}

export default function WorkedExample({ problemTex, stepsTex, solutionTex, masteryScore }: WorkedExampleProps) {
    const t = useTranslations('workedExample');
    // Deterministic Rule: Expertise Reversal Trigger
    // > 80%: Hide completely (independent solving only)
    // 60-80%: Partial (hide solution, show problem and first steps)
    // < 60%: Full worked example

    if (masteryScore > 80) {
        return null; // Trigger fired: Hide examples to reduce extraneous load for experts
    }

    const isPartial = masteryScore >= 60 && masteryScore <= 80;

    return (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg mb-6 shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                    {t('title', { defaultMessage: 'Worked Example' })} {isPartial && t('partial', { defaultMessage: '(Partial)' })}
                </h3>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    {isPartial ? 'Fading Guidance Mode' : 'Full Guidance Mode'}
                </span>
            </div>

            <div className="mb-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('problemLabel', { defaultMessage: 'Problem:' })}</p>
                <MathRenderer latex={problemTex} display={true} />
            </div>

            <div className="mb-4 space-y-2">
                <p className="font-semibold text-gray-700 dark:text-gray-300">{t('stepsLabel', { defaultMessage: 'Steps:' })}</p>
                {stepsTex.map((step, idx) => (
                    // In partial mode, only show the first half of the steps
                    (!isPartial || idx < stepsTex.length / 2) && (
                        <div key={idx} className="pl-4 border-l-2 border-blue-300 py-1">
                            <MathRenderer latex={step} display={true} />
                        </div>
                    )
                ))}
                {isPartial && (
                    <div className="pl-4 border-l-2 border-blue-300 py-4 text-center text-gray-500 italic">
                        {t('completeTheRest', { defaultMessage: '... You complete the rest.' })}
                    </div>
                )}
            </div>

            {!isPartial && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/50">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('solutionLabel', { defaultMessage: 'Final Solution:' })}</p>
                    <MathRenderer latex={solutionTex} display={true} />
                </div>
            )}

        </div>
    );
}
