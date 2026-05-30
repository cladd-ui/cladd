import { SectionTitle, Select, Surface } from '@cladd-ui/react';
import { useState } from 'react';

import { Icon } from './Icon';

export default function SelectDemo() {
  const [value, setValue] = useState('');
  return (
    <>
      <SectionTitle>Select</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-center"
        outline
        className="rounded-3xl"
      >
        <Select
          rounded
          title="Select an option"
          value={value}
          options={Array.from({ length: 50 }).map((_, i) => `Option ${i + 1}`)}
          search
          scrollToSelected
          valueClassName="truncate"
          icon={<Icon />}
          onChange={(v) => setValue(v as string)}
          placeholder="Choose an option"
        >
          {value}
        </Select>
      </Surface>
    </>
  );
}
