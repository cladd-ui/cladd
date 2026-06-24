import {
  Button,
  Dialog,
  DialogClose,
  DialogRoot,
  DialogTrigger,
  Input,
  SectionTitle,
  Surface,
  useDialog,
} from '@cladd-ui/react';
import { useState } from 'react';

export default function DialogDemo() {
  const dialog = useDialog();
  const [name, setName] = useState('Google');
  return (
    <>
      <SectionTitle>Dialog</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-start"
        outline
        variant="gradient"
        className="rounded-3xl"
      >
        <Button onClick={() => dialog.alert({ title: 'Title', text: 'Text' })}>
          Dialog (imperative)
        </Button>
        <DialogRoot>
          <DialogTrigger>
            <Button rounded surfaceLevel={1}>
              Open Dialog
            </Button>
          </DialogTrigger>
          <Dialog
            title="Test Title"
            text="Hello this is the text here."
            requireConfirmText="TEST"
            cancelButtonText="Cancel"
            confirmButtonText="Confirm"
          >
            <DialogClose>
              <Button>Close</Button>
            </DialogClose>
          </Dialog>
        </DialogRoot>
        <DialogRoot>
          <DialogTrigger>
            <Button rounded surfaceLevel={1}>
              Edit name
            </Button>
          </DialogTrigger>
          {/* Type in the field and press Enter -> confirms (no Tab needed). */}
          <Dialog
            title="Edit name"
            cancelButtonText="Cancel"
            confirmButtonText="Save"
          >
            <Input value={name} onChange={setName} clearButton autoFocus />
          </Dialog>
        </DialogRoot>
      </Surface>
    </>
  );
}
