import { Button, SectionTitle, Surface, SurfaceCut } from '@cladd-ui/react';

const COLORS = [
  'neutral',
  'brand',
  'red',
  'pink',
  'purple',
  'blue',
  'cyan',
  'lime',
  'green',
  'yellow',
  'orange',
];

export default function SurfaceDemo() {
  return (
    <>
      <SectionTitle>Surface — variants</SectionTitle>
      <div className="flex flex-col gap-4">
        <Surface className="rounded-full p-4" variant="transparent">
          Surface Transparent
        </Surface>
        <Surface className="rounded-full p-4" variant="solid">
          Surface Solid
        </Surface>
        <Surface className="rounded-full p-4" variant="gradient">
          Surface Gradient
        </Surface>
        <Surface className="rounded-full p-4" variant="transparent" outline>
          Surface Outline Transparent
        </Surface>
        <Surface className="rounded-full p-4" variant="solid" outline>
          Surface Outline Solid
        </Surface>
        <Surface className="rounded-full p-4" variant="gradient" outline>
          Surface Outline Gradient
        </Surface>
      </div>

      <SectionTitle>Surface — nested hoverable/clickable</SectionTitle>
      <Surface
        className="w-60 rounded-2xl"
        contentClassName="p-4"
        outline
        variant="gradient"
        hoverable
        clickable
      >
        <div>
          <Button color="red">Test</Button>
        </div>
      </Surface>
      <Surface
        className="w-60 rounded-2xl"
        contentClassName="p-4"
        outline
        variant="gradient"
      >
        <Button variant="transparent">Test</Button>
      </Surface>

      <SectionTitle>Surface — overlay position (below vs above)</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm opacity-60">below </div>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            outline
            variant="gradient"
            hoverable
            clickable
            overlayPosition="below"
          >
            Solid gradient surface with some text content
          </Surface>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            outline
            variant="gradient-fill"
            hoverable
            clickable
            overlayPosition="below"
          >
            Gradient-fill surface with some text content
          </Surface>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            variant="transparent"
            hoverable
            clickable
            overlayPosition="below"
          >
            Transparent surface with some text content
          </Surface>
          <SurfaceCut
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            hoverable
            clickable
            overlayPosition="below"
          >
            SurfaceCut with some text content
          </SurfaceCut>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm opacity-60">above (default)</div>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            outline
            variant="gradient"
            hoverable
            clickable
            overlayPosition="above"
          >
            Solid gradient surface with some text content
          </Surface>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            outline
            variant="gradient-fill"
            hoverable
            clickable
            overlayPosition="above"
          >
            Gradient-fill surface with some text content
          </Surface>
          <Surface
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            variant="transparent"
            hoverable
            clickable
            overlayPosition="above"
          >
            Transparent surface with some text content
          </Surface>
          <SurfaceCut
            className="w-60 rounded-2xl"
            contentClassName="p-4"
            hoverable
            clickable
            overlayPosition="above"
          >
            SurfaceCut with some text content
          </SurfaceCut>
        </div>
      </div>

      <SectionTitle>Surface — colors × nesting levels</SectionTitle>
      <div className="flex max-w-full gap-4 overflow-auto">
        {COLORS.map((color) => (
          <Surface
            key={color}
            outline
            className="rounded-3xl text-xs"
            contentClassName="p-4"
            color={color}
          >
            <SectionTitle className="mb-4 text-[10px] whitespace-nowrap">
              Surface {color}: 1
            </SectionTitle>
            <SurfaceCut
              className="mb-2 rounded-full"
              outline
              contentClassName="p-4"
            />
            <div className="my-4 h-px bg-cladd-outline" />
            <Surface
              outline
              className="rounded-3xl"
              contentClassName="p-4"
              color={color}
            >
              <SectionTitle className="mb-4 text-[10px] whitespace-nowrap">
                Surface {color}: 2
              </SectionTitle>
              <div className="mb-1 bg-cladd-surface-prev p-1">Prev</div>
              <div className="mb-1 bg-cladd-surface-minus p-1">Minus</div>
              <div className="mb-1 bg-cladd-surface p-1">Current</div>
              <div className="mb-1 bg-cladd-surface-plus p-1">Plus</div>
              <div className="mb-1 bg-cladd-surface-next p-1">Next</div>
              <SurfaceCut
                className="mb-2 rounded-full"
                outline
                contentClassName="p-4"
              />
              <div className="my-4 h-px bg-cladd-outline" />
              <Surface
                outline
                className="rounded-3xl"
                contentClassName="p-4"
                color={color}
              >
                <SectionTitle className="mb-4 text-[10px] whitespace-nowrap">
                  Surface {color}: 3
                </SectionTitle>
                <div className="mb-1 bg-cladd-surface-prev p-1">Prev</div>
                <div className="mb-1 bg-cladd-surface-minus p-1">Minus</div>
                <div className="mb-1 bg-cladd-surface p-1">Current</div>
                <div className="mb-1 bg-cladd-surface-plus p-1">Plus</div>
                <div className="mb-1 bg-cladd-surface-next p-1">Next</div>
                <SurfaceCut
                  className="mb-2 rounded-full"
                  outline
                  contentClassName="p-4"
                />
                <div className="my-4 h-px bg-cladd-outline" />
                <Surface
                  outline
                  className="rounded-3xl"
                  contentClassName="p-4"
                  color={color}
                >
                  <SectionTitle className="mb-4 text-[10px] whitespace-nowrap">
                    Surface {color}: 4
                  </SectionTitle>
                  <div className="mb-1 bg-cladd-surface-prev p-1">Prev</div>
                  <div className="mb-1 bg-cladd-surface-minus p-1">Minus</div>
                  <div className="mb-1 bg-cladd-surface p-1">Current</div>
                  <div className="mb-1 bg-cladd-surface-plus p-1">Plus</div>
                  <div className="mb-1 bg-cladd-surface-next p-1">Next</div>
                  <SurfaceCut
                    className="mb-2 rounded-full"
                    outline
                    contentClassName="p-4"
                  />
                  <div className="my-4 h-px bg-cladd-outline" />
                  <Surface
                    outline
                    className="rounded-3xl"
                    contentClassName="p-4"
                    color={color}
                  >
                    <SectionTitle className="mb-4 text-[10px] whitespace-nowrap">
                      Surface {color}: 5
                    </SectionTitle>
                    <div className="mb-1 bg-cladd-surface-prev p-1">Prev</div>
                    <div className="mb-1 bg-cladd-surface-minus p-1">Minus</div>
                    <div className="mb-1 bg-cladd-surface p-1">Current</div>
                    <div className="mb-1 bg-cladd-surface-plus p-1">Plus</div>
                    <div className="mb-1 bg-cladd-surface-next p-1">Next</div>
                    <SurfaceCut
                      className="mb-2 rounded-full"
                      outline
                      contentClassName="p-4"
                    />
                    <div className="my-4 h-px bg-cladd-outline" />
                  </Surface>
                </Surface>
              </Surface>
            </Surface>
          </Surface>
        ))}
      </div>
    </>
  );
}
