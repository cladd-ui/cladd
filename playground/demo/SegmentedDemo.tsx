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
      </Surface>
    </>
  );
}
