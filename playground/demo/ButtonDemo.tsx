import { Button, SectionTitle, Surface } from '@cladd-ui/react';

import { Icon } from './Icon';

export default function ButtonDemo() {
  return (
    <>
      <SectionTitle>Buttons</SectionTitle>
      <Surface
        outline
        className="rounded-3xl"
        contentClassName="p-4 flex flex-col gap-4"
        level={1}
      >
        <div className="flex items-center gap-2">
          <Button loading>Loading</Button>
          <Button size="sm">Button SM</Button>
          <Button size="md">Button MD</Button>
          <Button size="lg">Button LG</Button>
          <Button size="xl">Button XL</Button>
          <Button size="2xl">Button 2XL</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Icon />
            Button SM
          </Button>
          <Button size="md">
            <Icon />
            Button MD
          </Button>
          <Button size="lg">
            <Icon />
            Button LG
          </Button>
          <Button size="xl">
            <Icon />
            Button XL
          </Button>
          <Button size="2xl">
            <Icon />
            Button 2XL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button rounded size="sm">
            Button SM
          </Button>
          <Button rounded size="md">
            Button MD
          </Button>
          <Button rounded size="lg">
            Button LG
          </Button>
          <Button rounded size="xl">
            Button XL
          </Button>
          <Button rounded size="2xl">
            Button 2XL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button rounded multiline size="sm">
            Button SM
          </Button>
          <Button rounded multiline size="md">
            Button MD
          </Button>
          <Button rounded multiline size="lg">
            Button LG
          </Button>
          <Button rounded multiline size="xl">
            Button XL
          </Button>
          <Button rounded multiline size="2xl">
            Button 2XL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button rounded multiline size="sm">
            Button SM
            <br /> Multiline <br /> Multiline
          </Button>
          <Button rounded multiline size="md">
            Button MD
            <br /> Multiline <br /> Multiline
          </Button>
          <Button rounded multiline size="lg">
            Button LG
            <br /> Multiline <br /> Multiline
          </Button>
          <Button rounded multiline size="xl">
            Button XL
            <br /> Multiline <br /> Multiline
          </Button>
          <Button rounded multiline size="2xl">
            Button 2XL
            <br /> Multiline <br /> Multiline
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button rounded size="sm" color="red">
            <Icon />
            Button SM
          </Button>
          <Button rounded size="md" color="green">
            <Icon />
            Button MD
          </Button>
          <Button rounded size="lg" color="brand">
            <Icon />
            Button LG
          </Button>
          <Button rounded size="xl" color="blue">
            <Icon />
            Button XL
          </Button>
          <Button rounded size="2xl" color="pink">
            <Icon />
            Button 2XL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button rounded size="sm" variant="gradient-fill">
            <Icon />
            Button SM
          </Button>
          <Button rounded size="sm" color="red" variant="gradient-fill">
            <Icon />
            Button SM
          </Button>
          <Button rounded size="md" color="green" variant="gradient-fill">
            <Icon />
            Button MD
          </Button>
          <Button rounded size="lg" color="brand" variant="gradient-fill">
            <Icon />
            Button LG
          </Button>
          <Button rounded size="xl" color="blue" variant="gradient-fill">
            <Icon />
            Button XL
          </Button>
          <Button rounded size="2xl" color="pink" variant="gradient-fill">
            <Icon />
            Button 2XL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="2xl">
            Button with Surface
            <Surface variant="gradient" contentClassName="p-2 px-4">
              S
            </Surface>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-cladd-xs text-cladd-fg-soft">
            tightFocusRing — both buttons are force-focused inside a snug
            overflow-auto box. The default offset ring overflows it
            (scrollbars); the tight ring sits flush.
          </span>
          <div className="flex items-center gap-6">
            <div className="flex overflow-auto bg-black/20 ring-1 ring-white/15">
              <Button>Offset</Button>
            </div>
            <div className="flex overflow-auto bg-black/20 ring-1 ring-white/15">
              <Button tightFocusRing>Tight</Button>
            </div>
          </div>
        </div>
      </Surface>
    </>
  );
}
