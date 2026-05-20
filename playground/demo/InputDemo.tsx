import { Button, Input, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

import { Icon } from './Icon';

export default function InputDemo() {
  const [value, setValue] = useState('Test');
  return (
    <>
      <SectionTitle>Input</SectionTitle>
      <Surface
        contentClassName="p-4 grid grid-cols-3 gap-4"
        className="rounded-3xl"
        outline
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">SM:</span>
            <Button size="sm">Button</Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">SM:</span>
            <Input
              size="sm"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Button size="md">Button</Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Input
              infoMessage="Tadamba parapamba"
              size="md"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Button size="lg">Button</Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Input
              size="lg"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Button size="xl">Button</Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Input
              size="xl"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Surface
              contentClassName="p-1"
              outline
              className="rounded-full"
              variant="gradient"
            >
              <Button rounded size="sm" variant="transparent" outline={false}>
                <Icon />
                Button
              </Button>
            </Surface>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Input
              icon={<Icon />}
              rounded
              size="md"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Surface
              contentClassName="p-1"
              outline
              className="rounded-full"
              variant="gradient"
            >
              <Button rounded size="md" variant="transparent" outline={false}>
                <Icon />
                Button
              </Button>
            </Surface>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Input
              icon={<Icon />}
              rounded
              size="lg"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Surface
              contentClassName="p-1"
              outline
              className="rounded-full"
              variant="gradient"
            >
              <Button rounded size="lg" variant="transparent" outline={false}>
                <Icon />
                Button
              </Button>
            </Surface>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Input
              icon={<Icon />}
              rounded
              size="xl"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">SM:</span>
            <Button size="sm">
              <Icon />
              Button
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">SM:</span>
            <Input
              icon={<Icon />}
              size="sm"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Button size="md">
              <Icon />
              Button
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">MD:</span>
            <Input
              icon={<Icon />}
              size="md"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Button size="lg">
              <Icon />
              Button
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">LG:</span>
            <Input
              icon={<Icon />}
              size="lg"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Button size="xl">
              <Icon />
              Button
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">XL:</span>
            <Input
              icon={<Icon />}
              size="xl"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">2XL:</span>
            <Button
              size="2xl"
              variant="solid"
              className="duration-200"
              outline={false}
            >
              <Icon />
              Button
            </Button>
          </div>
          <div className="flex items-start gap-4">
            <span className="font-mono leading-none">2XL:</span>
            <Input
              icon={<Icon />}
              size="2xl"
              value={value}
              onChange={(v) => setValue(v)}
              clearButton
            />
          </div>
        </div>
      </Surface>
    </>
  );
}
