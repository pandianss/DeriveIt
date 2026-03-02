'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Question {
    id: string;
    text: string;
    expectedFormula: string;
    hint: string;
}

interface ActiveRecallTestProps {
    questions: Question[];
}

export default function ActiveRecallTest({ questions }: ActiveRecallTestProps) {
    const t = useTranslations('activeRecall');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Anti-cheat: disable copy/paste and right click
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleCopy = (e: ClipboardEvent) => e.preventDefault();
        const handlePaste = (e: ClipboardEvent) => e.preventDefault();

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);

        // Warn on beforeunload
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    if (isFinished) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                <h2 className="text-2xl font-bold mb-4">{t('sessionComplete', { defaultMessage: 'Assessment Complete' })}</h2>
                <p className="text-lg mb-6">{t('scoreReport', { score, total: questions.length, defaultMessage: `You scored ${score} out of ${questions.length}` })}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${(score / questions.length) * 100}%` }}></div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Deterministic validation: normalize whitespace to compare
        const normalizedInput = userInput.replace(/\s+/g, '');
        const normalizedExpected = currentQuestion.expectedFormula.replace(/\s+/g, '');

        if (normalizedInput === normalizedExpected) {
            setFeedback(t('correct', { defaultMessage: 'Correct!' }));
            setScore(s => s + 1);

            setTimeout(() => {
                setFeedback(null);
                setUserInput('');
                if (currentIndex + 1 < questions.length) {
                    setCurrentIndex(i => i + 1);
                } else {
                    setIsFinished(true);
                }
            }, 1500);
        } else {
            // No strict "fail" state, guide the user
            setFeedback(t('incorrect', { defaultMessage: 'Not yet. Review the structure and try again.' }));
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('questionProgress', { current: currentIndex + 1, total: questions.length, defaultMessage: `Question ${currentIndex + 1} of ${questions.length}` })}
                </h3>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Active Recall</span>
            </div>

            <div className="mb-6">
                <p className="text-lg mb-4 text-gray-800 dark:text-gray-200">{currentQuestion.text}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="formula-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('inputLabel', { defaultMessage: 'Construct the LaTeX formula from memory:' })}
                    </label>
                    <input
                        id="formula-input"
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                        placeholder="e.g. \frac{a}{b}"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button
                        type="button"
                        onClick={() => alert(currentQuestion.hint)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {t('requestHint', { defaultMessage: 'Need a hint?' })}
                    </button>
                    <button
                        type="submit"
                        disabled={!userInput.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                    >
                        {t('submit', { defaultMessage: 'Submit' })}
                    </button>
                </div>
            </form>

            {feedback && (
                <div className={`mt-6 p-4 rounded-lg ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
}
