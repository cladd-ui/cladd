import {
  Button,
  SectionTitle,
  Surface,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@cladd-ui/react';

import { Icon } from './Icon';

export default function ToolbarDemo() {
  return (
    <>
      <SectionTitle>Toolbar</SectionTitle>
      <Toolbar size="sm">
        <ToolbarButton>Button 1</ToolbarButton>
        <ToolbarButton>Button 2</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Button 3</ToolbarButton>
      </Toolbar>

      <SectionTitle>Toolbar — transparent</SectionTitle>
      <Surface
        contentClassName="p-1 h-9 flex items-center"
        className="rounded-full"
        outline
        variant="transparent"
      >
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          variant="transparent"
          contentClassName="flex items-center px-2.5"
        >
          Board
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          variant="transparent"
          contentClassName="flex items-center px-2.5"
        >
          List
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          level={3}
          contentClassName="flex items-center px-2.5"
        >
          Calendar
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          contentClassName="flex items-center px-2.5"
        >
          Gantt
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          contentClassName="flex items-center px-2.5"
        >
          <div className="size-4 rounded-full bg-white/30" />
        </Surface>
      </Surface>

      <SectionTitle>Toolbar — solid</SectionTitle>
      <Surface
        contentClassName="p-1 h-9 flex items-center"
        className="rounded-full"
        outline
        variant="solid"
        level={1}
      >
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          variant="transparent"
          contentClassName="flex items-center px-2.5"
        >
          Board
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          variant="transparent"
          contentClassName="flex items-center px-2.5"
        >
          List
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          level="+2"
          contentClassName="flex items-center px-2.5"
        >
          Calendar
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          contentClassName="flex items-center px-2.5"
        >
          Gantt
        </Surface>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          contentClassName="flex items-center px-2.5"
        >
          <div className="size-4 rounded-full bg-white/30" />
        </Surface>
      </Surface>

      <SectionTitle>Toolbar — gradient</SectionTitle>
      <Surface
        contentClassName="p-1 h-9 flex items-center"
        className="rounded-full"
        outline
        variant="gradient"
        level={1}
      >
        <Button rounded variant="transparent" outline={false}>
          <Icon />
        </Button>
        <Button rounded variant="transparent" outline={false}>
          <Icon />
        </Button>
        <Button color="brand" variant="gradient-fill" rounded readOnly>
          <Icon />
          Calendar
        </Button>
        <Button rounded>Gantt</Button>
        <Surface
          className="h-7 cursor-default rounded-full text-xs"
          hoverable
          clickable
          contentClassName="flex items-center px-2.5"
        >
          <div className="size-4 rounded-full bg-white/30" />
        </Surface>
      </Surface>
    </>
  );
}
