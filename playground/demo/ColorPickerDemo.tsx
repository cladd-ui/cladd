import { ColorPicker, SectionTitle, Surface } from '@cladd-ui/react';
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

const BorderIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="size-4">
    <rect
      x="2.5"
      y="2.5"
      width="11"
      height="11"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default function ColorPickerDemo() {
  const [fill, setFill] = useState('#3b82f6');
  const [stroke, setStroke] = useState<string | undefined>(undefined);
  const [gradient, setGradient] = useState(
    'linear-gradient(90deg, #3b82f6 0%, #ec4899 100%)',
  );

  return (
    <>
      <SectionTitle>ColorPicker</SectionTitle>
      <Surface
        outline
        variant="gradient"
        className="rounded-3xl"
        contentClassName="flex flex-wrap items-start gap-8 p-4"
      >
        {/* Basic — auto hex value */}
        <div className="flex w-64 flex-col gap-3">
          <ColorPicker value={fill} onChange={(c) => setFill(c.hex)} />

          {/* Empty / transparent — shows the dim close icon in the swatch */}
          <ColorPicker
            value={stroke}
            placeholder="No color"
            onChange={(c) => setStroke(c.css)}
          />

          {/* Gradient */}
          <ColorPicker
            gradient
            swatches={PALETTE}
            color="pink"
            popoverColor="pink"
            value={gradient}
            onChange={(c) => setGradient(c.css)}
          />

          {/* Custom children: icon + value + trailing label, PaneFlow-style */}
          <ColorPicker
            value={fill}
            icon={<BorderIcon />}
            onChange={(c) => setFill(c.hex)}
          >
            <span className="flex w-full items-center gap-2">
              <span className="min-w-0 shrink truncate">{fill}</span>
              <span className="ml-auto shrink-0 text-cladd-fg-softer">
                Fill Color
              </span>
            </span>
          </ColorPicker>
        </div>

        {/* Sizes */}
        <div className="flex w-56 flex-col gap-3">
          <ColorPicker size="sm" defaultValue="#22c55e" />
          <ColorPicker size="md" defaultValue="#f59e0b" />
          <ColorPicker size="lg" defaultValue="rgba(236, 72, 153, 0.5)" />
          <ColorPicker rounded outline defaultValue="#8b5cf6" />
        </div>
      </Surface>
    </>
  );
}
