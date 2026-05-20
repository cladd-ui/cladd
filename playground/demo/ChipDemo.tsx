import { Button, Chip, SectionTitle, Surface } from '@cladd-ui/react';

import { Icon } from './Icon';

export default function ChipDemo() {
  return (
    <>
      <SectionTitle>Chip</SectionTitle>
      <Surface
        outline
        className="rounded-3xl"
        contentClassName="p-4 flex gap-2 flex-wrap"
        level={1}
      >
        <Chip size="2xs" rounded clickable color="green" variant="solid-fill">
          Chip 2XS
        </Chip>
        <Chip size="2xs" rounded clickable color="green">
          <Icon />
          Chip 2XS
        </Chip>
        <Chip size="xs" rounded clickable color="green">
          Chip XS
        </Chip>
        <Chip size="xs" rounded clickable color="green">
          <Icon />
          Chip XS
        </Chip>
        <Chip size="sm" rounded clickable color="green">
          Chip SM
        </Chip>
        <Chip size="sm" outline rounded clickable color="green">
          Chip SM
        </Chip>
        <Chip size="sm" outline rounded clickable color="green">
          <Icon />
          Chip SM
        </Chip>
        <Chip size="md" color="red" rounded clickable>
          <Icon />
          Chip MD
        </Chip>
        <Chip size="md" color="red" outline rounded clickable>
          <Icon />
          Chip MD
          <Icon />
        </Chip>
        <Chip size="md" rounded clickable>
          <Icon />
          Chip MD
        </Chip>
        <Chip size="md" outline rounded clickable>
          <Icon />
          Chip MD
        </Chip>
        <Chip size="md" outline rounded clickable color="green">
          Chip MD
        </Chip>
        <Chip
          size="md"
          outline
          rounded
          clickable
          color="green"
          variant="gradient-fill"
        >
          <Icon />
          Chip MD
        </Chip>
        <Chip size="lg" outline rounded clickable color="green">
          Chip LG
        </Chip>
        <Chip size="lg" outline rounded clickable color="green">
          <Icon />
          Chip LG
          <Icon />
        </Chip>
        <Chip size="xl" outline rounded clickable color="green">
          <Icon />
          Chip XL
        </Chip>
        <Chip size="2xl" outline rounded clickable color="green">
          <Icon />
          Chip 2XL
        </Chip>
      </Surface>

      <SectionTitle>Chips in Buttons</SectionTitle>
      <Surface
        outline
        className="rounded-3xl"
        contentClassName="p-4 flex gap-2 flex-wrap"
        level={1}
      >
        <Button size="2xs" color="red">
          2XS
          <Chip color="neutral" size="2xs">
            CHIP
          </Chip>
        </Button>
        <Button size="xs" color="red">
          XS
          <Chip size="xs">CHIP</Chip>
        </Button>
        <Button size="sm" color="red">
          SM
          <Chip size="sm">CHIP</Chip>
        </Button>
        <Button size="md">
          MD
          <Chip size="md">CHIP</Chip>
        </Button>
        <Button size="lg">
          LG
          <Chip size="lg">CHIP</Chip>
        </Button>
        <Button size="xl">
          XL
          <Chip size="xl">CHIP</Chip>
        </Button>
        <Button size="2xl">
          2XL
          <Chip size="2xl">CHIP</Chip>
        </Button>
      </Surface>
    </>
  );
}
