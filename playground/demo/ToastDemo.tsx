import { Button, SectionTitle, Surface, useToast } from '@cladd-ui/react';

import { Icon } from './Icon';

export default function ToastDemo() {
  const toast = useToast();

  return (
    <>
      <SectionTitle>Toast</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-start"
        outline
        variant="gradient"
        className="rounded-3xl"
      >
        <Button
          onClick={() => {
            toast({ text: 'Text', icon: Icon });
          }}
        >
          Show Toast
        </Button>
      </Surface>
    </>
  );
}
