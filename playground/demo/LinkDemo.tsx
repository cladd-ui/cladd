import { Link, SectionTitle, Surface } from '@cladd-ui/react';

export default function LinkDemo() {
  return (
    <>
      <SectionTitle>Link</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4"
        outline
        className="rounded-3xl"
      >
        <div className="flex gap-8">
          <Link>Link 1</Link>
          <Link color="red">Link 2 (red)</Link>
        </div>
      </Surface>
    </>
  );
}
