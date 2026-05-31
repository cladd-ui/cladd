import { ColorEditor, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

const PALETTE = [
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#000000',
];

export default function ColorEditorDemo() {
  const [solid, setSolid] = useState('#3b82f6');
  const [alpha, setAlpha] = useState('rgba(168, 85, 247, 0.6)');
  const [gradient, setGradient] = useState(
    'linear-gradient(90deg, #3b82f6 0%, #ec4899 100%)',
  );
  const [gradient2, setGradient2] = useState(
    'linear-gradient(45deg, #f59e0b 0%, #ef4444 100%)',
  );

  return (
    <>
      <SectionTitle>ColorEditor</SectionTitle>
      <Surface
        outline
        variant="gradient"
        className="rounded-3xl"
        contentClassName="flex flex-wrap items-start gap-8 p-4"
      >
        {/* Solid + swatches — container sets the width */}
        <div className="flex w-56 flex-col gap-2">
          <ColorEditor
            value={solid}
            onChange={(c) => setSolid(c.hex)}
            swatches={PALETTE}
          />
          <div className="flex items-center gap-2 text-cladd-xs text-cladd-fg-soft">
            <span
              className="size-4 rounded-cladd-xs shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
              style={{ background: solid }}
            />
            <code>{solid}</code>
          </div>
        </div>

        {/* HSL format, controlled in rgba, larger controls */}
        <div className="w-60">
          <ColorEditor
            controlSize="lg"
            format="hsl"
            value={alpha}
            onChange={(c) => setAlpha(c.css)}
          />
        </div>

        {/* Gradient */}
        <div className="flex w-64 flex-col gap-2">
          <ColorEditor
            gradient
            swatches={PALETTE}
            value={gradient}
            onChange={(c) => {
              console.log(c);
              setGradient(c.css);
            }}
          />
          <div
            className="h-8 w-full rounded-cladd-md shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
            style={{ background: gradient }}
          />
        </div>

        {/* Gradient with the 45°-step rotate button instead of the scrubber */}
        <div className="flex w-64 flex-col gap-2">
          <ColorEditor
            gradient
            angleControl="button"
            value={gradient2}
            onChange={(c) => setGradient2(c.css)}
          />
          <div
            className="h-8 w-full rounded-cladd-md shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"
            style={{ background: gradient2 }}
          />
        </div>

        {/* Compact, area only — accent inherited from a colored Surface */}
        <Surface
          color="green"
          className="w-44 rounded-2xl"
          contentClassName="p-3"
        >
          <ColorEditor
            controlSize="sm"
            defaultValue="#22c55e"
            alpha={false}
            inputs={false}
            hexInput={false}
            areaClassName="h-28"
          />
        </Surface>
      </Surface>
    </>
  );
}
