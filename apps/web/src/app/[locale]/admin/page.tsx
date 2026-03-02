'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SystemAdminDashboard() {
    const t = useTranslations('admin');
    const [activeTab, setActiveTab] = useState<'cms' | 'moderation'>('cms');

    return (
        <div className="max-w-7xl mx-auto p-8 flex min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-gray-200 dark:border-gray-800 pr-8 mr-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">MathPath Admin</h1>
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-8">System High Auth</p>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('cms')}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'cms' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                    >
                        {t('cmsTab', { defaultMessage: 'Content CMS' })}
                    </button>
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'moderation' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                    >
                        {t('modTab', { defaultMessage: 'Moderation Tools' })}
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                {activeTab === 'cms' && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Module Content Schema (MongoDB)</h2>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm uppercase tracking-wide text-gray-500">
                                        <th className="p-4 font-medium">Module ID</th>
                                        <th className="p-4 font-medium">Topic</th>
                                        <th className="p-4 font-medium">Locale Status</th>
                                        <th className="p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="p-4 font-mono text-sm">CALC-101</td>
                                        <td className="p-4">Definition of Derivative</td>
                                        <td className="p-4 flex gap-2">
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">EN</span>
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">TA</span>
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">HI (Missing)</span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:underline text-sm font-medium">Edit JSON</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="p-4 font-mono text-sm">ALG-04A</td>
                                        <td className="p-4">Quadratic Formula Structure</td>
                                        <td className="p-4 flex gap-2">
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">EN</span>
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">TA</span>
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">HI</span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:underline text-sm font-medium">Edit JSON</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'moderation' && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Global Account Moderation</h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6 text-yellow-800 dark:text-yellow-400">
                            <strong>Audit Log Active:</strong> All actions taken here are permanently logged against your Administrator UUID.
                        </div>

                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search by UUID or Email..."
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                            <button className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition shadow">Search</button>
                        </div>

                        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-center text-gray-500">
                            Enter a query to load user profile, subscription history, and strict mastery overrides.
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
