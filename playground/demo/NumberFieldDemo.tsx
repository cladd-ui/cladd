import { NumberField, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

export default function NumberFieldDemo() {
  const [value, setValue] = useState(10);
  return (
    <>
      <SectionTitle>NumberField</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-center"
        outline
        className="rounded-3xl"
      >
        <div>{value}</div>
        <NumberField
          size="sm"
          input
          value={value}
          rounded={false}
          max={99}
          onChange={setValue}
        />
        <NumberField
          input
          value={value}
          rounded={false}
          max={99}
          onChange={setValue}
        />
        <NumberField
          variant="solid-fill"
          color="red"
          size="lg"
          input
          value={value}
          rounded={false}
          max={90}
          step={10}
          onChange={setValue}
        />
        <NumberField
          size="xl"
          input
          value={value}
          rounded={false}
          max={99}
          onChange={setValue}
        />
        <NumberField
          size="2xl"
          input
          value={value}
          rounded={false}
          max={99}
          onChange={setValue}
        />
      </Surface>
    </>
  );
}
