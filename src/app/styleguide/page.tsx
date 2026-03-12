import React from "react";

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-32">
        <header>
          <h1 className="font-heading text-[64px] font-extrabold leading-[1.1] tracking-tight">
            Design System
          </h1>
          <p className="text-muted-foreground mt-4 text-[16px]">
            Visual direction and design tokens for the SaaS product.
          </p>
        </header>

        {/* 1. COLOR PALETTE */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ColorSwatch name="Background" hex="#FDFBF7" usage="Main page background" colorClass="bg-background border border-border" />
            <ColorSwatch name="Surface" hex="#FFFFFF" usage="Cards, floating elements" colorClass="bg-white border border-border" />
            <ColorSwatch name="Primary" hex="#1A1A1A" usage="Near-black for CTAs" colorClass="bg-primary" />
            <ColorSwatch name="Secondary" hex="#F2F0EB" usage="Secondary button/tags" colorClass="bg-secondary" />
            <ColorSwatch name="Accent" hex="#FF5C35" usage="Highlights, logo" colorClass="bg-accent text-white" />
            <ColorSwatch name="Text Primary" hex="#1A1A1A" usage="Headings, primary copy" colorClass="bg-foreground" />
            <ColorSwatch name="Text Secondary" hex="#666666" usage="Descriptions, subtext" colorClass="bg-muted-foreground" />
            <ColorSwatch name="Border" hex="#EAEAEA" usage="Subtle boundaries" colorClass="bg-border" />
          </div>
        </section>

        {/* 2. TYPOGRAPHY */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Typography
          </h2>
          <div className="space-y-12">
            <TypeExample level="H1 (Hero)" font="Plus Jakarta Sans" size="64px" weight="Extra Bold (800)" lineHeight="1.1" className="font-heading text-[64px] font-extrabold leading-[1.1]" />
            <TypeExample level="H2 (Section titles)" font="Plus Jakarta Sans" size="40px" weight="Bold (700)" lineHeight="1.2" className="font-heading text-[40px] font-bold leading-[1.2]" />
            <TypeExample level="H3 (Card titles)" font="Plus Jakarta Sans" size="24px" weight="Semi-Bold (600)" lineHeight="1.3" className="font-heading text-[24px] font-semibold leading-[1.3]" />
            <TypeExample level="Body" font="Inter" size="16px" weight="Regular (400)" lineHeight="1.6" className="font-sans text-[16px] font-normal leading-[1.6]" />
            <TypeExample level="Body Small" font="Inter" size="14px" weight="Regular (400)" lineHeight="1.5" className="font-sans text-[14px] font-normal leading-[1.5]" />
            <TypeExample level="Caption" font="Inter" size="12px" weight="Medium (500)" lineHeight="1.4" className="font-sans text-[12px] font-medium leading-[1.4]" />
          </div>
        </section>

        {/* 3. SPACING */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Spacing System
          </h2>
          <div className="space-y-6">
            <SpacingExample name="xs" value="4px" usage="Tight grouping" sizeClass="w-[4px]" />
            <SpacingExample name="sm" value="8px" usage="Small gaps" sizeClass="w-[8px]" />
            <SpacingExample name="md" value="16px" usage="Standard spacing" sizeClass="w-[16px]" />
            <SpacingExample name="lg" value="24px" usage="Component padding" sizeClass="w-[24px]" />
            <SpacingExample name="xl" value="32px" usage="Large component spacing" sizeClass="w-[32px]" />
            <SpacingExample name="2xl" value="64px" usage="Minor section spacing" sizeClass="w-[64px]" />
            <SpacingExample name="3xl" value="128px" usage="Major section spacing" sizeClass="w-[128px]" />
          </div>
        </section>

        {/* 4. BORDER RADIUS */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Border Radius
          </h2>
          <div className="flex flex-wrap gap-8 items-end">
            <RadiusExample name="sm" value="4px" radiusClass="rounded-sm" />
            <RadiusExample name="md" value="8px" radiusClass="rounded-md" />
            <RadiusExample name="lg" value="16px" radiusClass="rounded-lg" />
            <RadiusExample name="xl" value="24px" radiusClass="rounded-xl" />
            <RadiusExample name="full (pill)" value="9999px" radiusClass="rounded-full w-32" />
          </div>
        </section>

        {/* 5. BUTTONS */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Buttons
          </h2>
          <div className="space-y-8">
            <div className="flex flex-wrap gap-8 items-center">
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Primary (Default)</span>
                <button className="bg-primary text-primary-foreground font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Primary Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Primary (Hover)</span>
                <button className="bg-[#333333] text-primary-foreground font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Primary Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Primary (Disabled)</span>
                <button disabled className="bg-primary/50 text-primary-foreground font-sans text-[14px] font-medium px-5 py-2.5 rounded-full cursor-not-allowed">Primary Button</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center">
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Secondary (Default)</span>
                <button className="bg-white text-primary border border-border font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Secondary Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Secondary (Hover)</span>
                <button className="bg-[#F9F9F9] text-primary border border-border font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Secondary Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Secondary (Disabled)</span>
                <button disabled className="bg-white text-primary/50 border border-border/50 font-sans text-[14px] font-medium px-5 py-2.5 rounded-full cursor-not-allowed">Secondary Button</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center">
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Ghost (Default)</span>
                <button className="bg-transparent text-muted-foreground font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Ghost Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Ghost (Hover)</span>
                <button className="bg-black/5 text-primary font-sans text-[14px] font-medium px-5 py-2.5 rounded-full">Ghost Button</button>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-medium text-muted-foreground block">Ghost (Disabled)</span>
                <button disabled className="bg-transparent text-muted-foreground/50 font-sans text-[14px] font-medium px-5 py-2.5 rounded-full cursor-not-allowed">Ghost Button</button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CARDS */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Cards
          </h2>
          <div className="bg-white border border-border rounded-lg p-6 max-w-md">
            <h3 className="font-heading text-[24px] font-semibold leading-[1.3] mb-2">
              Sample Card Title
            </h3>
            <p className="font-sans text-[16px] font-normal leading-[1.6] text-muted-foreground mb-6">
              This card demonstrates the standard white background, subtle gray border, large border radius, and generous padding used throughout the interface.
            </p>
            <div className="flex justify-end space-x-3">
              <button className="bg-white text-primary border border-border font-sans text-[14px] font-medium px-4 py-2 rounded-full">Cancel</button>
              <button className="bg-primary text-primary-foreground font-sans text-[14px] font-medium px-4 py-2 rounded-full">Confirm</button>
            </div>
          </div>
        </section>

        {/* 7. INPUT FIELDS */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Input Fields
          </h2>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="font-sans text-[14px] font-medium text-primary">Email Address (Default)</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white border border-border rounded-md px-[20px] py-[12px] font-sans text-[16px] text-primary placeholder:text-[#999999] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[14px] font-medium text-primary">Email Address (Focus)</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white border border-primary rounded-md px-[20px] py-[12px] font-sans text-[16px] text-primary placeholder:text-[#999999] outline outline-2 outline-[rgba(26,26,26,0.2)] outline-offset-2"
                  defaultValue="user@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="font-sans text-[14px] font-medium text-primary">Message (Textarea)</label>
                <textarea 
                  placeholder="How can we help?" 
                  rows={4}
                  className="w-full bg-white border border-border rounded-md px-[20px] py-[12px] font-sans text-[16px] text-primary placeholder:text-[#999999] outline-none focus:border-primary focus:outline focus:outline-2 focus:outline-[rgba(26,26,26,0.2)] focus:outline-offset-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. SHADOWS */}
        <section>
          <h2 className="font-heading text-[40px] font-bold leading-[1.2] mb-8 border-b border-border pb-4">
            Shadows
          </h2>
          <div className="flex flex-wrap gap-8">
            <ShadowExample name="sm" description="Minor interactive elements" shadowClass="shadow-sm" />
            <ShadowExample name="md" description="Floating navbars / hover" shadowClass="shadow-md" />
            <ShadowExample name="lg" description="Main product mockups" shadowClass="shadow-lg" />
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper Components

function ColorSwatch({ name, hex, usage, colorClass }: { name: string, hex: string, usage: string, colorClass: string }) {
  return (
    <div className="space-y-3">
      <div className={`h-24 w-full rounded-lg ${colorClass}`}></div>
      <div>
        <h4 className="font-sans font-semibold text-[16px]">{name}</h4>
        <p className="font-mono text-[14px] text-muted-foreground mt-1">{hex}</p>
        <p className="font-sans text-[12px] text-muted-foreground mt-1 leading-[1.4]">{usage}</p>
      </div>
    </div>
  );
}

function TypeExample({ level, font, size, weight, lineHeight, className }: { level: string, font: string, size: string, weight: string, lineHeight: string, className: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-border/50 pb-6 last:border-0">
      <div className="w-48 shrink-0">
        <h4 className="font-sans font-medium text-[14px] text-muted-foreground">{level}</h4>
        <p className="font-sans text-[12px] text-muted-foreground mt-1">{font}</p>
        <p className="font-sans text-[12px] text-muted-foreground mt-0.5">{size} / {weight}</p>
        <p className="font-sans text-[12px] text-muted-foreground mt-0.5">LH: {lineHeight}</p>
      </div>
      <div className="flex-1">
        <p className={className}>The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  );
}

function SpacingExample({ name, value, usage, sizeClass }: { name: string, value: string, usage: string, sizeClass: string }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-24 shrink-0">
        <h4 className="font-sans font-medium text-[14px]">{name}</h4>
        <p className="font-sans text-[12px] text-muted-foreground">{value}</p>
      </div>
      <div className="flex-1 max-w-md">
        <div className={`h-8 bg-accent/20 rounded-sm ${sizeClass}`}></div>
      </div>
      <div className="flex-1">
        <p className="font-sans text-[14px] text-muted-foreground">{usage}</p>
      </div>
    </div>
  );
}

function RadiusExample({ name, value, radiusClass }: { name: string, value: string, radiusClass: string }) {
  return (
    <div className="space-y-3">
      <div className={`h-24 w-24 bg-secondary border border-border flex items-center justify-center ${radiusClass}`}>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[14px] text-center">{name}</h4>
        <p className="font-sans text-[12px] text-muted-foreground text-center">{value}</p>
      </div>
    </div>
  );
}

function ShadowExample({ name, description, shadowClass }: { name: string, description: string, shadowClass: string }) {
  return (
    <div className="space-y-4">
      <div className={`h-32 w-48 bg-white rounded-lg flex items-center justify-center ${shadowClass}`}>
        <span className="font-sans text-[14px] font-medium text-muted-foreground">{name}</span>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[14px]">{name} shadow</h4>
        <p className="font-sans text-[12px] text-muted-foreground mt-1 max-w-[12rem] leading-[1.4]">{description}</p>
      </div>
    </div>
  );
}