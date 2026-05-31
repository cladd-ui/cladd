import {
  SectionTitle,
  Surface,
  ToggleButton,
  ToggleGroup,
  Toolbar,
} from '@cladd-ui/react';
import { useState } from 'react';

export default function ToggleDemo() {
  const [view, setView] = useState<string | string[] | undefined>('grid');
  const [marks, setMarks] = useState<string | string[] | undefined>(['bold']);
  const [pinned, setPinned] = useState(false);

  return (
    <>
      <SectionTitle>Toggle</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 items-start"
        outline
        className="rounded-3xl"
      >
        {/* Standalone ToggleButtons - each owns its state */}
        <Toolbar>
          <ToggleButton defaultSelected>Bold</ToggleButton>
          <ToggleButton>Italic</ToggleButton>
          <ToggleButton
            selected={pinned}
            onChange={setPinned}
            activeColor="neutral"
          >
            {pinned ? 'Pinned' : 'Pin'}
          </ToggleButton>
        </Toolbar>

        {/* Single-select group - click the active one to deselect */}
        <ToggleGroup value={view} onValueChange={setView} activeColor="neutral">
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="board">Board</ToggleButton>
        </ToggleGroup>

        {/* Multiple */}
        <ToggleGroup multiple value={marks} onValueChange={setMarks}>
          <ToggleButton value="bold">Bold</ToggleButton>
          <ToggleButton value="italic">Italic</ToggleButton>
          <ToggleButton value="underline">Underline</ToggleButton>
        </ToggleGroup>
      </Surface>
    </>
  );
}
