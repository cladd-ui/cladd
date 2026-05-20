import { Button, SectionTitle, Surface, Switch } from '@cladd-ui/react';
import { useState } from 'react';

import { Icon } from './Icon';

export default function SwitchDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <SectionTitle>Switch</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <div className="flex items-center gap-8">
          <Switch disabled />
          <Switch disabled checked />
          <Switch checked={checked} onChange={setChecked} />
          <Button size="md">Button MD</Button>
          <Surface
            contentClassName="p-1 flex items-center"
            outline
            className="self-start rounded-full"
            variant="gradient"
          >
            <Button rounded variant="transparent" outline={false}>
              Test
            </Button>
            <Button rounded variant="transparent" outline={false}>
              <Icon />
            </Button>
            <Switch checked={checked} onChange={setChecked} />
          </Surface>
        </div>
      </Surface>
    </>
  );
}
