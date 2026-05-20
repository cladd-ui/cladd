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
        <Slider />
        <SectionTitle>Read only</SectionTitle>

        <Slider readOnly />
        <SectionTitle>Disabled</SectionTitle>
        <Slider disabled value={50} />
        <SectionTitle>Log scale</SectionTitle>
        <Slider min={20} max={20000} defaultValue={440} scale="log" />
      </Surface>
    </>
  );
}
