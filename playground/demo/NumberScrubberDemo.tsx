import { NumberScrubber, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

import { Icon } from './Icon';

export default function NumberScrubberDemo() {
  const [value, setValue] = useState(100);
  return (
    <>
      <SectionTitle>NumberScrubber</SectionTitle>
      <Surface
        outline
        variant="gradient"
        className="rounded-3xl"
        contentClassName="flex flex-col gap-4 p-4"
      >
        <NumberScrubber
          icon={<Icon />}
          value={value}
          min={0}
          max={1000}
          step={1}
          rounded
          displayValue={(v) => `${v} px`}
          onChange={setValue}
          className="w-32"
        />
      </Surface>
    </>
  );
}
