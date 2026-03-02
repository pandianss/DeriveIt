'use client';

import React, { useEffect, useRef } from 'react';

interface MathRendererClientProps {
    latex: string;
    display?: boolean;
    className?: string;
}

/**
 * Client-side LaTeX renderer using KaTeX loaded from CDN.
 * Used inside client components like WorkedExample and ActiveRecallTest.
 */
export default function MathRendererClient({ latex, display = true, className = '' }: MathRendererClientProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const render = () => {
            if (!ref.current) return;
            try {
                // @ts-ignore
                if (window.katex) {
                    // @ts-ignore
                    window.katex.render(latex, ref.current, {
                        displayMode: display,
                        throwOnError: false,
                    });
                }
            } catch (e) {
                if (ref.current) {
                    ref.current.innerHTML = `<span style="color:red">Error: ${latex}</span>`;
                }
            }
        };

        // Load KaTeX if not already loaded
        if (!(window as any).katex) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            script.onload = render;
            document.head.appendChild(script);
        } else {
            render();
        }
    }, [latex, display]);

    return (
        <div
            ref={ref}
            className={`math-rendered-client ${display ? 'block text-center my-4' : 'inline-block px-1'} ${className}`}
            style={{ overflowX: 'auto', overflowY: 'hidden' }}
        >
            <span className="text-gray-400 italic text-sm">{latex}</span>
        </div>
    );
}
