import { SectionTitle, Slider, Surface } from '@cladd-ui/react';

export default function SliderDemo() {
  return (
    <>
      <SectionTitle>Slider</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <SectionTitle>Default</SectionTitle>
        <Slider size="xs" />
        <Slider size="sm" />
        <Slider size="md" />
        <SectionTitle>Read only</SectionTitle>

        <Slider readOnly />
        <SectionTitle>Disabled</SectionTitle>
        <Slider disabled value={50} />
        <SectionTitle>Log scale</SectionTitle>
        <Slider min={20} max={20000} defaultValue={440} scale="log" />
        <SectionTitle>Track variant</SectionTitle>
        <Slider variant="track" size="xs" defaultValue={30} />
        <Slider variant="track" color="neutral" size="sm" defaultValue={50} />
        <Slider variant="track" color="neutral" size="md" defaultValue={70} />
        <Slider variant="track" color="green" defaultValue={40} />
        <Slider variant="track" readOnly defaultValue={50} />
        <Slider variant="track" disabled value={50} />
        <SectionTitle>Track variant rounded</SectionTitle>
        <Slider variant="track" rounded size="xs" defaultValue={30} />
        <Slider variant="track" rounded size="sm" defaultValue={50} />
        <Slider variant="track" rounded size="md" defaultValue={70} />
        <SectionTitle>Track variant rangeFill</SectionTitle>
        <Slider variant="track" rangeFill defaultValue={50} />
        <Slider variant="track" rangeFill color="green" defaultValue={40} />
        <Slider
          variant="track"
          rangeFill
          rangeOutline={false}
          defaultValue={60}
        />
        <SectionTitle>Track variant color inherit</SectionTitle>
        <div className="cladd-color-purple">
          <Slider variant="track" rangeFill defaultValue={55} />
        </div>
      </Surface>
    </>
  );
}
