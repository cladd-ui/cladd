import { SectionTitle, Select, Surface } from '@cladd-ui/react';
import { useState } from 'react';

import { Icon } from './Icon';

export default function SelectDemo() {
  const [value, setValue] = useState('');
  const [multiple, setMultiple] = useState(['1', '2']);

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

        <Select
          rounded
          title="Select an option"
          value={multiple}
          multiple
          options={['1', '2', '3', '4', '5']}
          search
          scrollToSelected
          valueClassName="truncate"
          icon={<Icon />}
          onChange={(v) => {
            setMultiple(v);
          }}
          placeholder="Choose an option"
        >
          {multiple.join(', ')}
        </Select>
      </Surface>
    </>
  );
}
