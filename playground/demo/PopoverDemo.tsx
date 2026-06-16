import {
  Button,
  Popover,
  PopoverClose,
  PopoverRoot,
  PopoverTrigger,
  SectionTitle,
  Surface,
  Tooltip,
} from '@cladd-ui/react';

export default function PopoverDemo() {
  return (
    <>
      <SectionTitle>Popover</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-start"
        outline
        variant="gradient"
        className="rounded-3xl"
      >
        <PopoverRoot>
          <PopoverTrigger>
            <Tooltip tooltip="Open popover">
              <Button>Popover</Button>
            </Tooltip>
          </PopoverTrigger>
          <Popover contentClassName="p-4" position="bottom-start">
            <PopoverClose>
              <Button>Close</Button>
            </PopoverClose>
            <PopoverRoot>
              <PopoverTrigger>
                <Button>Popover 2</Button>
              </PopoverTrigger>
              <Popover contentClassName="p-4" position="bottom-start">
                <PopoverRoot>
                  <PopoverTrigger>
                    <Button>Popover 3</Button>
                  </PopoverTrigger>
                  <Popover contentClassName="p-4" position="bottom-start">
                    <div className="p-4">Hello World</div>
                  </Popover>
                </PopoverRoot>
              </Popover>
            </PopoverRoot>
          </Popover>
        </PopoverRoot>

        <PopoverRoot>
          <PopoverTrigger>
            <Button>Centered</Button>
          </PopoverTrigger>
          <Popover contentClassName="p-4" position="center" backdrop>
            <div className="p-4">Opens centered over the trigger</div>
          </Popover>
        </PopoverRoot>
      </Surface>
    </>
  );
}
