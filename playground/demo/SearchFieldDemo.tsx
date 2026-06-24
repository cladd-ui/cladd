import { Button, SearchField, SectionTitle, Surface } from '@cladd-ui/react';
import { useState } from 'react';

export default function SearchFieldDemo() {
  const [value, setValue] = useState('Google');
  return (
    <>
      <SectionTitle>SearchField</SectionTitle>
      <Surface
        contentClassName="p-4 flex flex-col gap-4 w-80"
        className="rounded-3xl"
        outline
      >
        {/* Type, then Tab: focus should skip the clear (✕) and land on Cancel.
            Press Escape while the field has a value to clear it. */}
        <SearchField value={value} onChange={setValue} />
        <div className="flex justify-end gap-2">
          <Button onClick={() => setValue('')}>Cancel</Button>
          <Button color="green">Save</Button>
        </div>
      </Surface>
    </>
  );
}
