'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function InstitutionalDashboard() {
    const t = useTranslations('institution');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [seatsUsed, setSeatsUsed] = useState(45);
    const seatLimit = 100;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!csvFile) return;
        setUploadStatus('uploading');

        // Simulate API call to Django for Bulk CSV Parsing
        setTimeout(() => {
            setUploadStatus('success');
            setSeatsUsed(prev => prev + 12); // Simulated new students
            setCsvFile(null);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('dashboardTitle', { defaultMessage: 'Institutional Dashboard' })}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {t('dashboardDesc', { defaultMessage: 'Manage cohorts, import student rosters, and monitor enterprise license usage.' })}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">License Utilization</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{seatsUsed}</span>
                        <span className="text-sm text-gray-500">/ {seatLimit} seats</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                        <div
                            className={`h-2 rounded-full ${seatsUsed / seatLimit > 0.9 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${(seatsUsed / seatLimit) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Active Cohorts */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Active Cohorts</h3>
                    <div className="mt-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">3</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">Calculus 101, Algebra H, Physics I</p>
                </div>
            </div>

            {/* Bulk Import Section */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    {t('bulkImportTitle', { defaultMessage: 'Bulk CSV Student Import' })}
                </h2>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!csvFile || uploadStatus === 'uploading'}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium transition"
                    >
                        {uploadStatus === 'uploading' ? 'Importing...' : 'Upload & Provision'}
                    </button>
                </div>
                {uploadStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm">
                        Successfully parsed CSV and provisioned deterministic learner accounts. Welcome emails dispatched.
                    </div>
                )}
            </section>
        </div>
    );
}
