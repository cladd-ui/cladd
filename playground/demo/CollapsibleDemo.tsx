import {
  Button,
  CollapsibleIndicator,
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
  SectionTitle,
  Surface,
} from '@cladd-ui/react';
import { SVGProps, useState } from 'react';

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

export default function CollapsibleDemo() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <SectionTitle>Collapsible</SectionTitle>
      <Surface
        contentClassName="flex w-80 flex-col gap-4 p-4"
        outline
        className="rounded-3xl"
      >
        {/* Uncontrolled, BYO chevron rotated via injected data-open */}
        <CollapsibleRoot defaultOpen>
          <CollapsibleTrigger>
            <Button
              className={'group'}
              variant="transparent"
              outline={false}
              contentClassName="justify-between"
              size="xl"
            >
              Advanced settings
              <ChevronDown className="size-4 -rotate-90 text-cladd-fg-soft transition-transform duration-200 group-data-[open]:rotate-0" />
            </Button>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="px-3 pt-1 pb-2 text-cladd-sm text-cladd-fg-soft">
              Tucked-away options that most people never touch. Block padding
              lives on this inner element so the panel collapses cleanly to
              zero.
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>

        {/* Controlled + render-prop indicator (plus ↔ minus) */}
        <CollapsibleRoot open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>
            <Button
              className={'group'}
              variant="transparent"
              outline={false}
              contentClassName="justify-between"
              size="xl"
            >
              Notes
              <CollapsibleIndicator className="size-4 items-center justify-center text-cladd-fg-soft">
                {({ open }) => <span>{open ? '−' : '+'}</span>}
              </CollapsibleIndicator>
            </Button>
          </CollapsibleTrigger>
          <CollapsiblePanel keepMounted>
            <div className="px-3 pt-1 pb-2 text-cladd-sm text-cladd-fg-soft">
              <code>open = {String(open)}</code> — this panel stays mounted
              while collapsed (<code>keepMounted</code>).
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>

        {/* Disabled */}
        <CollapsibleRoot disabled>
          <CollapsibleTrigger>
            <Button
              className={'group'}
              variant="transparent"
              outline={false}
              contentClassName="justify-between"
              size="xl"
            >
              Locked section
              <ChevronDown className="size-4 -rotate-90 text-cladd-fg-soft" />
            </Button>
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="px-3 pt-1 pb-2 text-cladd-sm text-cladd-fg-soft">
              Never reachable while disabled.
            </div>
          </CollapsiblePanel>
        </CollapsibleRoot>
      </Surface>
    </>
  );
}
