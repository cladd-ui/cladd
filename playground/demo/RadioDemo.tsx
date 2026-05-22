import { Radio, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

export default function RadioDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <SectionTitle>Radio</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <div className="flex gap-8">
          <Radio size="xs" checked={checked} onChange={setChecked} />
          <Radio size="sm" checked={checked} onChange={setChecked} />
          <Radio size="md" checked={checked} onChange={setChecked} />
          <Radio disabled onChange={setChecked} />
          <Radio disabled checked={checked} onChange={setChecked} />
          <Radio readOnly onChange={setChecked} />
          <Radio readOnly checked={checked} onChange={setChecked} />
        </div>
      </Surface>
    </>
  );
}
