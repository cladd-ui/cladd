import {
  Button,
  ButtonSize,
  SectionTitle,
  Spinner,
  SpinnerSize,
  Surface,
} from '@cladd-ui/react';

const SIZES: SpinnerSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export default function SpinnerDemo() {
  return (
    <>
      <SectionTitle>Spinner</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-start"
        outline
        className="rounded-3xl"
      >
        {SIZES.map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="font-mono">{size.toUpperCase()}:</span>
            <Spinner size={size} />
            <Button size={size as ButtonSize}>
              Button <Spinner size={size} />
            </Button>
          </div>
        ))}
      </Surface>
    </>
  );
}
