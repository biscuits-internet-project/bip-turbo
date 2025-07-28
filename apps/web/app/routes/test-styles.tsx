import type { MetaFunction } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Style Test Page - BIP" },
    { name: "description", content: "Testing our design system colors and components" },
  ];
};

export default function TestStyles() {
  return (
    <div className="w-full p-8 space-y-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-gradient-start via-brand-gradient-mid to-brand-gradient-end bg-clip-text text-transparent">
          Design System Test Page
        </h1>
        <p className="text-xl text-content-text-secondary">
          Testing colors, components, and glass-morphism effects
        </p>
      </div>

      {/* Color Swatches */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 bg-purple-500 rounded mb-2"></div>
            <p className="text-sm font-medium">Purple 500</p>
            <p className="text-xs text-content-text-secondary">Brand Primary</p>
          </div>
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 bg-green-500 rounded mb-2"></div>
            <p className="text-sm font-medium">Green 500</p>
            <p className="text-xs text-content-text-secondary">Brand Tertiary</p>
          </div>
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 bg-purple-600 rounded mb-2"></div>
            <p className="text-sm font-medium">Purple 600</p>
            <p className="text-xs text-content-text-secondary">Deep Purple</p>
          </div>
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 bg-green-600 rounded mb-2"></div>
            <p className="text-sm font-medium">Green 600</p>
            <p className="text-xs text-content-text-secondary">Deep Green</p>
          </div>
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Semantic Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 rounded mb-2" style={{backgroundColor: "hsl(var(--brand-primary))"}}></div>
            <p className="text-sm font-medium">Brand Primary</p>
            <p className="text-xs text-content-text-secondary">Core purple brand</p>
          </div>
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 rounded mb-2" style={{backgroundColor: "hsl(var(--brand-secondary))"}}></div>
            <p className="text-sm font-medium">Brand Secondary</p>
            <p className="text-xs text-content-text-secondary">Lighter purple</p>
          </div>
          <div className="p-6 rounded-lg border text-center">
            <div className="w-full h-16 rounded mb-2" style={{backgroundColor: "hsl(var(--brand-tertiary))"}}></div>
            <p className="text-sm font-medium">Brand Tertiary</p>
            <p className="text-xs text-content-text-secondary">Green accent</p>
          </div>
        </div>
      </section>

      {/* Button Styles */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Button Components</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-accent">Accent Button</button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            Purple Utility
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Green Utility
          </button>
        </div>
      </section>

      {/* Glass Components */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Glass-morphism Effects</h2>
        
        {/* Direct CSS Test */}
        <div className="mb-8 p-6 rounded-lg" style={{
          backgroundColor: "hsla(263, 15%, 8%, 0.6)",
          border: "2px solid hsla(263, 80%, 60%, 1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        }}>
          <h3 className="text-lg font-semibold mb-2" style={{color: "hsl(var(--brand-primary))"}}>Direct CSS Test with Visible Border</h3>
          <p style={{color: "hsl(var(--content-text-secondary))"}}>
            This should be transparent with backdrop blur and have a bright purple border.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2" style={{color: "hsl(var(--brand-primary))"}}>Standard Glass</h3>
            <p style={{color: "hsl(var(--content-text-secondary))"}}>
              This card uses the standard glass effect with backdrop blur and purple-tinted background.
            </p>
          </div>
          <div className="glass-accent p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2" style={{color: "hsl(var(--brand-tertiary))"}}>Accent Glass</h3>
            <p style={{color: "hsl(var(--content-text-secondary))"}}>
              This card uses accent glass with green border highlights.
            </p>
          </div>
          <div className="card-premium p-6">
            <h3 className="text-lg font-semibold mb-2" style={{color: "hsl(var(--brand-primary))"}}>Premium Card</h3>
            <p style={{color: "hsl(var(--content-text-secondary))"}}>
              Premium card component with enhanced shadows and glass effects.
            </p>
          </div>
          <div className="card-premium-accent p-6">
            <h3 className="text-lg font-semibold mb-2" style={{color: "hsl(var(--brand-tertiary))"}}>Premium Accent Card</h3>
            <p style={{color: "hsl(var(--content-text-secondary))"}}>
              Premium card with green accent borders and enhanced visual hierarchy.
            </p>
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Gradient Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-brand-gradient p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold text-white mb-2">Brand Gradient</h3>
            <p className="text-white/90">Purple to deep purple brand gradient</p>
          </div>
          <div className="bg-chart-gradient p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold text-white mb-2">Chart Gradient</h3>
            <p className="text-white/90">Purple to green data visualization gradient</p>
          </div>
        </div>
      </section>

      {/* Text Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Typography Colors</h2>
        <div className="space-y-4 mb-8">
          <p className="text-lg" style={{color: "hsl(var(--content-text-primary))"}}>Primary text color - high contrast white</p>
          <p className="text-lg" style={{color: "hsl(var(--content-text-secondary))"}}>Secondary text color - medium contrast gray</p>
          <p className="text-lg" style={{color: "hsl(var(--content-text-tertiary))"}}>Tertiary text color - lower contrast muted</p>
          <p className="text-lg" style={{color: "hsl(var(--brand-primary))"}}>Brand primary text - core purple</p>
          <p className="text-lg" style={{color: "hsl(var(--brand-secondary))"}}>Brand secondary text - lighter purple</p>
          <p className="text-lg" style={{color: "hsl(var(--brand-tertiary))"}}>Brand tertiary text - green accent</p>
        </div>
      </section>

      {/* Interactive States */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Interactive States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{color: "hsl(var(--brand-primary))"}}>Hover Effects</h3>
            <div 
              className="p-4 rounded border transition-all cursor-pointer"
              style={{
                borderColor: "hsl(var(--border))",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--hover-subtle))";
                e.currentTarget.style.borderColor = "hsl(var(--hover-accent))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
              }}
            >
              Hover for subtle background
            </div>
            <div 
              className="p-4 rounded border transition-all cursor-pointer"
              style={{
                borderColor: "hsl(var(--border))",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--hover-glass))";
                e.currentTarget.style.borderColor = "hsl(var(--glass-border-accent))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "hsl(var(--border))";
              }}
            >
              Hover for glass effect
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-tertiary">Status Colors</h3>
            <div className="p-3 rounded border border-green-500 bg-green-500/10">
              <span className="text-green-500 font-medium">Success message</span>
            </div>
            <div className="p-3 rounded border border-yellow-500 bg-yellow-500/10">
              <span className="text-yellow-500 font-medium">Warning message</span>
            </div>
            <div className="p-3 rounded border border-red-500 bg-red-500/10">
              <span className="text-red-500 font-medium">Error message</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Simulation */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Navigation Styles</h2>
        <div className="glass p-6 rounded-lg mb-8">
          <nav className="space-y-2">
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer"
              style={{
                color: "hsl(var(--content-text-secondary))",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "hsl(var(--brand-primary))";
                e.currentTarget.style.backgroundColor = "hsl(var(--hover-glass))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(var(--content-text-secondary))";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="w-4 h-4 bg-current rounded"></span>
              Navigation Item (Hover)
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded"
              style={{
                backgroundColor: "hsl(var(--brand-primary))",
                color: "hsl(var(--content-text-primary))"
              }}
            >
              <span className="w-4 h-4 bg-current rounded"></span>
              Active Navigation Item
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-3 py-2 rounded transition-colors cursor-pointer"
              style={{
                color: "hsl(var(--content-text-secondary))",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "hsl(var(--brand-primary))";
                e.currentTarget.style.backgroundColor = "hsl(var(--hover-glass))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(var(--content-text-secondary))";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="w-4 h-4 bg-current rounded"></span>
              Another Navigation Item
            </a>
          </nav>
        </div>
      </section>

      {/* Raw CSS Custom Properties Test */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Raw CSS Properties Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded border text-center" style={{backgroundColor: "hsl(263 85% 60%)", color: "white"}}>
            <p className="text-sm font-medium">Direct HSL</p>
            <p className="text-xs">263 85% 60%</p>
          </div>
          <div className="p-4 rounded border text-center" style={{backgroundColor: "hsl(var(--purple-500))", color: "white"}}>
            <p className="text-sm font-medium">CSS Var Purple</p>
            <p className="text-xs">--purple-500</p>
          </div>
          <div className="p-4 rounded border text-center" style={{backgroundColor: "hsl(145 80% 55%)", color: "white"}}>
            <p className="text-sm font-medium">Direct HSL Green</p>
            <p className="text-xs">145 80% 55%</p>
          </div>
          <div className="p-4 rounded border text-center" style={{backgroundColor: "hsl(var(--green-500))", color: "white"}}>
            <p className="text-sm font-medium">CSS Var Green</p>
            <p className="text-xs">--green-500</p>
          </div>
        </div>
      </section>

      {/* Debug Information */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: "hsl(var(--brand-primary))"}}>Debug Information</h2>
        <div className="glass p-6 rounded-lg font-mono text-sm space-y-2">
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>Browser:</span> <span id="browser-info">Loading...</span></p>
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>--brand-primary:</span> <span id="brand-primary">Testing...</span></p>
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>--purple-500:</span> <span id="purple-500">Testing...</span></p>
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>--green-500:</span> <span id="green-500">Testing...</span></p>
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>text-brand-primary computed:</span> <span id="computed-brand">Testing...</span></p>
          <p><span style={{color: "hsl(var(--brand-tertiary))"}}>bg-purple-500 computed:</span> <span id="computed-purple">Testing...</span></p>
        </div>
      </section>

      {/* Real Test Elements */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Tailwind v4 Color Tests</h2>
        <div className="space-y-4">
          <div id="test-brand-primary" className="p-4 border text-brand-primary">
            ✅ text-brand-primary utility
          </div>
          <div id="test-brand-secondary" className="p-4 border text-brand-secondary">
            ✅ text-brand-secondary utility
          </div>
          <div id="test-brand-tertiary" className="p-4 border text-brand-tertiary">
            ✅ text-brand-tertiary utility
          </div>
          <div id="test-purple-500" className="p-4 border text-purple-500">
            ✅ text-purple-500 utility
          </div>
          <div id="test-green-500" className="p-4 border text-green-500">
            ✅ text-green-500 utility
          </div>
          <div id="test-content-text-primary" className="p-4 border text-content-text-primary">
            ✅ text-content-text-primary utility
          </div>
          <div id="test-content-text-secondary" className="p-4 border text-content-text-secondary">
            ✅ text-content-text-secondary utility
          </div>
          <div id="test-purple-bg" className="bg-purple-500 text-white p-4 border">
            ✅ bg-purple-500 utility
          </div>
          <div id="test-green-bg" className="bg-green-500 text-white p-4 border">
            ✅ bg-green-500 utility
          </div>
          <div id="test-brand-bg" className="bg-brand-primary text-white p-4 border">
            ✅ bg-brand-primary utility
          </div>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Debug info
          document.getElementById('browser-info').textContent = navigator.userAgent;
          
          // Get CSS custom property values
          const rootStyles = getComputedStyle(document.documentElement);
          const brandPrimary = rootStyles.getPropertyValue('--brand-primary').trim();
          const purple500 = rootStyles.getPropertyValue('--purple-500').trim();
          const green500 = rootStyles.getPropertyValue('--green-500').trim();
          
          document.getElementById('brand-primary').textContent = brandPrimary || 'NOT FOUND';
          document.getElementById('purple-500').textContent = purple500 || 'NOT FOUND';
          document.getElementById('green-500').textContent = green500 || 'NOT FOUND';
          
          // Get computed colors from actual elements
          const brandEl = document.getElementById('test-brand-primary');
          const purpleEl = document.getElementById('test-purple-bg');
          
          if (brandEl) {
            const computedColor = getComputedStyle(brandEl).color;
            document.getElementById('computed-brand').textContent = computedColor;
          }
          
          if (purpleEl) {
            const computedBg = getComputedStyle(purpleEl).backgroundColor;
            document.getElementById('computed-purple').textContent = computedBg;
          }
        `
      }} />
    </div>
  );
}