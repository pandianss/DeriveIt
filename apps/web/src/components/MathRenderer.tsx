import React from 'react';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

// Initialize the MathJax HTML document with light adaptor
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const texInput = new TeX({ packages: AllPackages });
const svgOutput = new SVG({ fontCache: 'local' });
const html = mathjax.document('', { InputJax: texInput, OutputJax: svgOutput });

/**
 * Pre-renders LaTeX to SVG on the server side to avoid client layout shifts and offline rendering failures.
 */
function renderLatexToSVG(latex: string, display: boolean = true): string {
    try {
        const node = html.convert(latex, { display });
        return adaptor.innerHTML(node);
    } catch (e) {
        console.error("MathJax Render Error:", e);
        return `<span style="color:red">Error rendering formula</span>`;
    }
}

interface MathRendererProps {
    latex: string;
    display?: boolean;
    className?: string;
}

export default function MathRenderer({ latex, display = true, className = "" }: MathRendererProps) {
    const svgCode = renderLatexToSVG(latex, display);

    return (
        <div
            className={`math-rendered-container ${display ? 'block text-center my-4' : 'inline-block px-1'} ${className}`}
            dangerouslySetInnerHTML={{ __html: svgCode }}
            style={{ overflowX: 'auto', overflowY: 'hidden' }}
        />
    );
}
