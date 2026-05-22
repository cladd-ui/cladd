import { Button, Checkbox, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <SectionTitle>Checkbox</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <div className="flex gap-8">
          <Checkbox size="xs" checked={checked} onChange={setChecked} />
          <Checkbox size="sm" checked={checked} onChange={setChecked} />
          <Checkbox size="md" checked={checked} onChange={setChecked} />
          <Checkbox disabled onChange={setChecked} />
          <Checkbox disabled checked={checked} onChange={setChecked} />
          <Checkbox readOnly onChange={setChecked} />
          <Checkbox readOnly checked={checked} onChange={setChecked} />
        </div>
        <div className="flex gap-8">
          <Button outline={false}>
            Checkbox <Checkbox size="xs" />
          </Button>
        </div>
      </Surface>
    </>
  );
}
