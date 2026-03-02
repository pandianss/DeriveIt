import MathRenderer from "@/components/MathRenderer";
import GeoGebraViewer from "@/components/GeoGebraViewer";
import ActiveRecallTest from "@/components/ActiveRecallTest";
import WorkedExample from "@/components/WorkedExample";
import NumeralFormatter from "@/components/NumeralFormatter";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">MathPath v2 Core Initialization</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Validating Node.js Server-Side MathJax Pre-rendering capability.
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Calculus: Definition of a Derivative</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          The concept of a derivative is at the core of calculus. It is fundamentally defined as:
        </p>
        <MathRenderer
          latex="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}"
          display={true}
        />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Notice how the formula is instantly rendered using server-side SVG conversion. There is no layout shift or client payload required to render this math.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Euler&apos;s Identity</h2>
        <MathRenderer
          latex="e^{i\pi} + 1 = 0"
          display={true}
        />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Level 1: Concrete Representation</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This GeoGebra diagram provides a visual, interactive representation of mathematical principles without requiring active formula construction.
        </p>
        <div className="flex justify-center flex-col items-center gap-4">
          <GeoGebraViewer
            id="demo-graph"
            appName="graphing"
            width={600}
            height={400}
            showZoomButtons={true}
          />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Level 2: Active Recall Testing</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Deterministic spaced repetition forcing memory retrieval without aids. Copy-paste and right-click are disabled.
        </p>
        <ActiveRecallTest
          questions={[
            { id: "q1", text: "What is the formula for Euler&apos;s Identity?", expectedFormula: "e^{i\\pi}+1=0", hint: "It connects the five fundamental constants." },
            { id: "q2", text: "Write the formal definition of a derivative.", expectedFormula: "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", hint: "Use the limit of the difference quotient." }
          ]}
        />
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Level 3: Expertise Reversal Trigger</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Deterministic fading of worked examples. As mastery score passes 60%, the example becomes partial. At 80%, it disappears entirely.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Novice (Score: 40%)</h4>
            <WorkedExample
              problemTex="\int x^2 \,dx"
              stepsTex={["= \\frac{x^3}{3} + C"]}
              solutionTex="\\frac{x^3}{3} + C"
              masteryScore={40}
            />
          </div>
          <div>
            <h4 className="font-bold mb-2">Intermediate (Score: 70%)</h4>
            <WorkedExample
              problemTex="\int_{0}^{2} x^2 \,dx"
              stepsTex={["= \\left[ \\frac{x^3}{3} \\right]_0^2", "= \\frac{2^3}{3} - \\frac{0^3}{3}"]}
              solutionTex="\\frac{8}{3}"
              masteryScore={70}
            />
          </div>
          <div>
            <h4 className="font-bold mb-2">Expert (Score: 90%)</h4>
            <WorkedExample
              problemTex="\int e^x \\sin(x) \,dx"
              stepsTex={["U = \\sin(x), V = e^x"]}
              solutionTex="\\frac{e^x(\\sin(x) - \\cos(x))}{2} + C"
              masteryScore={90}
            />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Level 4: Asian Numeral Formatting</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Native number formatting correctly groups numbers based on locale settings (e.g. Indian Lakhs/Crores vs Japanese Myriads).
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Number: 1,234,567.89 (Standard)</h4>
            <div className="p-3 bg-gray-50 border rounded font-mono text-gray-800">
              <NumeralFormatter value={1234567.89} />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Currency: MYR 12,345.67</h4>
            <div className="p-3 bg-gray-50 border rounded font-mono text-gray-800">
              <NumeralFormatter value={12345.67} style="currency" currency="MYR" />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
