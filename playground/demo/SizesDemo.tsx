import {
  Button,
  Checkbox,
  Chip,
  Input,
  Radio,
  SectionTitle,
  Slider,
  Surface,
  Switch,
  Textarea,
} from '@cladd-ui/react';

import { Icon } from './Icon';

export default function SizesDemo() {
  return (
    <>
      <SectionTitle>Sizes</SectionTitle>
      <Surface
        contentClassName="p-4 flex flex-col gap-4"
        className="rounded-3xl"
        outline
      >
        <div className="flex items-center gap-2">
          <div>SM:</div>
          <Button size="sm">Button</Button>
          <Input icon={<Icon />} size="sm" value="Ta-da" clearButton />
          <Textarea icon={<Icon />} size="sm" value="Ta-da" rounded />
          <Switch size="sm" />
          <Checkbox size="sm" />
          <Radio size="sm" />
          <Slider size="sm" />
          <Chip size="sm">Chip</Chip>
        </div>
        <div className="flex items-center gap-2">
          <div>MD:</div>
          <Button size="md">Button</Button>
          <Input size="md" value="Ta-da" clearButton />
          <Textarea size="md" value="Ta-da" rounded />
          <Switch size="md" />
          <Checkbox size="md" />
          <Radio size="md" />
          <Slider size="md" />
          <Chip size="md">Chip</Chip>
        </div>
        <div className="flex items-center gap-2">
          <div>LG:</div>
          <Button size="lg">Button</Button>
          <Input size="lg" value="Ta-da" clearButton />
          <Textarea size="lg" value="Ta-da" />
          <Switch size="md" />
          <Checkbox size="md" />
          <Radio size="md" />
          <Slider size="md" />
          <Chip size="lg">Chip</Chip>
        </div>
        <div className="flex items-center gap-2">
          <div>XL:</div>
          <Button size="xl">Button</Button>
          <Input size="xl" value="Ta-da" clearButton />
          <Textarea size="xl" value="Ta-da" />
          <Switch size="md" />
          <Checkbox size="md" />
          <Radio size="md" />
          <Slider size="md" />
          <Chip size="xl">Chip</Chip>
        </div>
        <div className="flex items-center gap-2">
          <div>2XL:</div>
          <Button size="2xl">Button</Button>
          <Input size="2xl" value="Ta-da" clearButton />
          <Textarea size="2xl" value="Ta-da" />
          <Switch size="md" />
          <Checkbox size="md" />
          <Radio size="md" />
          <Slider size="md" />
          <Chip size="2xl">Chip</Chip>
        </div>
      </Surface>
    </>
  );
}
