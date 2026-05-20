import { Button, SectionTitle, Shortcut, Surface } from '@cladd-ui/react';

export default function ShortcutDemo() {
  return (
    <>
      <SectionTitle>Shortcut</SectionTitle>
      <Surface
        outline
        variant="gradient"
        className="rounded-3xl"
        contentClassName="flex flex-col gap-4 p-4"
      >
        <Shortcut variant="solid-fill">cmd shift alt return up esc</Shortcut>
        <Button multiline size="2xs" rounded>
          Button 2XS{' '}
          <Shortcut size="2xs">alt tab cmd shift alt return up esc</Shortcut>
        </Button>
        <Button multiline size="xs" rounded>
          Button XS{' '}
          <Shortcut size="xs">alt tab cmd shift alt return up esc</Shortcut>
        </Button>
        <Button multiline size="sm" rounded>
          Button SM{' '}
          <Shortcut size="sm">alt tab cmd shift alt return up esc</Shortcut>
        </Button>
        <Button size="md">
          Button MD <Shortcut size="md">cmd shift alt return up esc</Shortcut>
        </Button>
        <Button size="lg">
          Button LG <Shortcut size="lg">cmd shift alt return up esc</Shortcut>
        </Button>
        <Button size="xl">
          Button XL <Shortcut size="xl">cmd shift alt return up esc</Shortcut>
        </Button>
        <Button size="2xl">
          Button 2XL <Shortcut size="2xl">cmd shift alt return up esc</Shortcut>
        </Button>
      </Surface>
    </>
  );
}
