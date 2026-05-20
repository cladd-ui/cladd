import { Button, SectionTitle, Surface } from '@cladd-ui/react';

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

export default function ColorsDemo() {
  return (
    <>
      <SectionTitle>Colors</SectionTitle>
      <div className="flex max-w-full flex-col gap-2 overflow-auto bg-cladd-bg">
        <div className="flex gap-4">
          <span className="w-30">Buttons</span>
          {COLORS.map((color) => (
            <Button key={color} color={color}>
              {color[0].toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-4">
          <span className="w-30">Buttons Tran</span>
          {COLORS.map((color) => (
            <Button key={color} variant="transparent" color={color}>
              {color[0].toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-4">
          <span className="w-30">Buttons Fill</span>
          {COLORS.map((color) => (
            <Button key={color} variant="gradient-fill" color={color}>
              {color[0].toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </div>
        <Surface variant="gradient" outline className="w-fit rounded-3xl">
          <div className="flex flex-col gap-2 p-4">
            <div className="flex gap-4">
              <span className="w-30">Buttons</span>
              {COLORS.map((color) => (
                <Button key={color} color={color}>
                  {color[0].toUpperCase() + color.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="w-30">Buttons Tran</span>
              {COLORS.map((color) => (
                <Button key={color} variant="transparent" color={color}>
                  {color[0].toUpperCase() + color.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="w-30">Buttons Fill</span>
              {COLORS.map((color) => (
                <Button key={color} variant="gradient-fill" color={color}>
                  {color[0].toUpperCase() + color.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-4">
              <span className="w-30">Buttons XL</span>
              {COLORS.map((color) => (
                <Button
                  key={color}
                  size="xl"
                  contentClassName="px-4"
                  color={color}
                >
                  {color[0].toUpperCase() + color.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}
