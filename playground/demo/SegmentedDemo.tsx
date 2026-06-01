import {
  SectionTitle,
  Segmented,
  SegmentedButton,
  Surface,
  Toolbar,
} from '@cladd-ui/react';
import { useState } from 'react';

export default function SegmentedDemo() {
  const [active, setActive] = useState(0);
  return (
    <>
      <SectionTitle>Segmented</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <Toolbar>
          <Segmented activeColor="neutral">
            <SegmentedButton active={active === 0} onClick={() => setActive(0)}>
              Button 1
            </SegmentedButton>
            <SegmentedButton active={active === 1} onClick={() => setActive(1)}>
              Button 2
            </SegmentedButton>
            <SegmentedButton active={active === 2} onClick={() => setActive(2)}>
              Button 3
            </SegmentedButton>
          </Segmented>
        </Toolbar>
        <Segmented activeColor="neutral">
          <SegmentedButton active={active === 0} onClick={() => setActive(0)}>
            Button 1
          </SegmentedButton>
          <SegmentedButton active={active === 1} onClick={() => setActive(1)}>
            Button 2
          </SegmentedButton>
          <SegmentedButton active={active === 2} onClick={() => setActive(2)}>
            Button 3
          </SegmentedButton>
        </Segmented>

        {/* Default activeColor: falls back to the theme accent. */}
        <Segmented>
          <SegmentedButton active={active === 0} onClick={() => setActive(0)}>
            Button 1
          </SegmentedButton>
          <SegmentedButton active={active === 1} onClick={() => setActive(1)}>
            Button 2
          </SegmentedButton>
          <SegmentedButton active={active === 2} onClick={() => setActive(2)}>
            Button 3
          </SegmentedButton>
        </Segmented>

        {/* Inside a colored surface: the active segment inherits the region color. */}
        <Toolbar
          color="purple"
          variant="gradient"
          outline
          className="rounded-2xl"
        >
          <Segmented activeColor="green">
            <SegmentedButton active={active === 0} onClick={() => setActive(0)}>
              Button 1
            </SegmentedButton>
            <SegmentedButton active={active === 1} onClick={() => setActive(1)}>
              Button 2
            </SegmentedButton>
            <SegmentedButton active={active === 2} onClick={() => setActive(2)}>
              Button 3
            </SegmentedButton>
          </Segmented>
        </Toolbar>
      </Surface>
    </>
  );
}
