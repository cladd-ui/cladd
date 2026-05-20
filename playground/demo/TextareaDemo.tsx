import { Input, SectionTitle, Surface, Textarea } from '@cladd-ui/react';

import { Icon } from './Icon';

export default function TextareaDemo() {
  return (
    <>
      <SectionTitle>Textarea</SectionTitle>
      <Surface
        className="rounded-3xl"
        outline
        contentClassName="p-4 grid grid-cols-3 gap-4"
      >
        <div className="flex flex-col gap-4">
          <SectionTitle>Input</SectionTitle>
          <Input icon={<Icon />} placeholder="SM: Add text" size="sm" />
          <Input
            disabled
            icon={<Icon />}
            placeholder="MD: Add text"
            size="md"
          />
          <Input icon={<Icon />} placeholder="LG: Add text" size="lg" />
          <Input icon={<Icon />} placeholder="XL: Add text" size="xl" />
          <Input icon={<Icon />} placeholder="2XL: Add text" size="2xl" />
        </div>
        <div className="flex flex-col gap-4">
          <SectionTitle>Textarea</SectionTitle>
          <Textarea icon={<Icon />} placeholder="SM: Add text" size="sm" />
          <Textarea
            disabled
            icon={<Icon />}
            placeholder="MD: Add text"
            size="md"
          />
          <Textarea icon={<Icon />} placeholder="LG: Add text" size="lg" />
          <Textarea icon={<Icon />} placeholder="XL: Add text" size="xl" />
          <Textarea icon={<Icon />} placeholder="2XL: Add text" size="2xl" />
        </div>
        <div className="flex flex-col gap-4">
          <SectionTitle>Textarea Rounded</SectionTitle>
          <Textarea
            icon={<Icon />}
            placeholder="Rounded SM: Add text"
            size="sm"
            rounded
          />
          <Textarea
            icon={<Icon />}
            placeholder="Rounded MD: Add text"
            size="md"
            rounded
          />
          <Textarea
            icon={<Icon />}
            placeholder="Rounded LG: Add text"
            size="lg"
            rounded
          />
          <Textarea
            icon={<Icon />}
            placeholder="Rounded XL: Add text"
            size="xl"
            rounded
          />
          <Textarea
            icon={<Icon />}
            placeholder="Rounded 2XL: Add text"
            size="2xl"
            rounded
          />
        </div>
      </Surface>
    </>
  );
}
