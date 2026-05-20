import {
  Button,
  Dialog,
  DialogClose,
  DialogRoot,
  DialogTrigger,
  SectionTitle,
  Surface,
  useDialog,
} from '@cladd-ui/react';

export default function DialogDemo() {
  const dialog = useDialog();
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
      </Surface>
    </>
  );
}
