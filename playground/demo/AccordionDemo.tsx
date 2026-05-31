import {
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
  SectionTitle,
  Surface,
} from '@cladd-ui/react';
import { SVGProps, useState } from 'react';

const headerClass =
  'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-cladd-sm text-cladd-fg hover:bg-cladd-surface-hover data-[disabled]:opacity-50';

const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m4 6 4 4 4-4" />
  </svg>
);

// The indicator itself carries data-open, so rotate it directly.
const Chevron = () => (
  <AccordionIndicator className="size-4 -rotate-90 text-cladd-fg-soft transition-transform duration-200 data-[open]:rotate-0">
    <ChevronDown className="size-4" />
  </AccordionIndicator>
);

const ITEMS = [
  {
    value: 'appearance',
    label: 'Appearance',
    body: 'Theme, accent color, density.',
  },
  { value: 'layout', label: 'Layout', body: 'Grid, spacing, breakpoints.' },
  {
    value: 'advanced',
    label: 'Advanced',
    body: 'Feature flags and experiments.',
  },
];

export default function AccordionDemo() {
  const [open, setOpen] = useState<string[]>(['appearance']);

  return (
    <>
      <SectionTitle>Accordion</SectionTitle>
      <div className="flex flex-wrap items-start gap-8">
        {/* Single-open (default), uncontrolled */}
        <Surface
          contentClassName="flex w-72 flex-col divide-y divide-cladd-outline"
          outline
          className="overflow-hidden rounded-3xl"
          wrapContent
        >
          <AccordionRoot defaultValue="appearance" multiple>
            {ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>
                  <button className={headerClass}>
                    {item.label}
                    <Chevron />
                  </button>
                </AccordionTrigger>
                <AccordionPanel>
                  <div className="px-3 pt-1 pb-3 text-cladd-sm text-cladd-fg-soft">
                    {item.body}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Surface>

        {/* Multiple-open, controlled */}
        <Surface
          contentClassName="flex w-72 flex-col divide-y divide-cladd-outline"
          outline
          className="overflow-hidden rounded-3xl"
          wrapContent
        >
          <AccordionRoot
            multiple
            value={open}
            onValueChange={(v) => setOpen(v as string[])}
          >
            {ITEMS.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                disabled={item.value === 'advanced'}
              >
                <AccordionTrigger>
                  <button className={headerClass}>
                    {item.label}
                    <Chevron />
                  </button>
                </AccordionTrigger>
                <AccordionPanel>
                  <div className="px-3 pt-1 pb-3 text-cladd-sm text-cladd-fg-soft">
                    {item.body}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Surface>
      </div>
    </>
  );
}
