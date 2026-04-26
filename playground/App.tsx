import {
  BlockTitle,
  Button,
  ButtonSize,
  Checkbox,
  Chip,
  Dialog,
  DialogClose,
  DialogRoot,
  DialogTrigger,
  Input,
  Link,
  List,
  ListButton,
  ListItem,
  ListSeparator,
  NumberField,
  OTPField,
  OTPFieldInput,
  OTPFieldSeparator,
  Popover,
  PopoverClose,
  PopoverRoot,
  PopoverTrigger,
  Popup,
  PopupClose,
  PopupContent,
  PopupRoot,
  PopupTrigger,
  Preloader,
  PreloaderSize,
  Radio,
  Range,
  Segmented,
  SegmentedButton,
  Select,
  Surface,
  SurfaceCut,
  TextArea,
  Toggle,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  UIProvider,
  WithTooltip,
  cn,
  useDialog,
  useToast,
} from '@cladd-ui/react';
import { useState } from 'react';

const Icon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <g fill="currentColor">
        <path
          d="m2,4.75v8.5c0,1.517,1.233,2.75,2.75,2.75h8.5c1.517,0,2.75-1.233,2.75-2.75V4.75c0-1.517-1.233-2.75-2.75-2.75H4.75c-1.517,0-2.75,1.233-2.75,2.75Zm8,.5c0-.414.336-.75.75-.75h2c.414,0,.75.336.75.75v3c0,.414-.336.75-.75.75h-2c-.414,0-.75-.336-.75-.75v-3Zm-5.5,0c0-.414.336-.75.75-.75h2c.414,0,.75.336.75.75v7.5c0,.414-.336.75-.75.75h-2c-.414,0-.75-.336-.75-.75v-7.5Z"
          strokeWidth="0"
        ></path>
      </g>
    </svg>
  );
};

function App() {
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState(0);
  const [selectValue, setSelectValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpGrouped, setOtpGrouped] = useState('');
  const [otpAlpha, setOtpAlpha] = useState('');

  const DialogTest = () => {
    const dialog = useDialog();
    return (
      <Surface
        level={1}
        className={'size-24 rounded-3xl'}
        outline
        variant="solid"
        onClick={() => {
          dialog.alert({ title: 'Title', text: 'Text' });
        }}
      >
        Dialog
      </Surface>
    );
  };
  const ToastTest = () => {
    const toast = useToast();
    return (
      <Surface
        level={1}
        className={'size-24 rounded-3xl'}
        outline
        variant="solid"
        onClick={() => {
          toast({ text: 'Text', icon: <Icon /> });
        }}
      >
        Toast
      </Surface>
    );
  };

  return (
    <UIProvider theme="dark">
      <div
        className={cn('flex flex-col items-start gap-8 p-8 text-on-surface')}
      >
        <BlockTitle>Toolbar</BlockTitle>
        <Toolbar size="sm">
          <ToolbarButton>Button 1</ToolbarButton>
          <ToolbarButton>Button 2</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Button 3</ToolbarButton>
        </Toolbar>
        <BlockTitle>Nested Popovers Test</BlockTitle>
        <PopoverRoot>
          <PopoverTrigger>
            <WithTooltip tooltip="Tooltip text">
              <Button>Popover</Button>
            </WithTooltip>
          </PopoverTrigger>
          <Popover contentClassName="p-4">
            <PopoverClose>
              <Button>Close</Button>
            </PopoverClose>
            <PopoverRoot>
              <PopoverTrigger>
                <Button>Popover 2</Button>
              </PopoverTrigger>

              <Popover contentClassName="p-4">
                <PopoverRoot>
                  <PopoverTrigger>
                    <Button>Popover 3</Button>
                  </PopoverTrigger>
                  <Popover contentClassName="p-4">
                    <div className="p-4">Hello World</div>
                  </Popover>
                </PopoverRoot>
              </Popover>
            </PopoverRoot>
          </Popover>
        </PopoverRoot>
        <BlockTitle>Colors Test</BlockTitle>

        <div
          className={cn(
            'flex max-w-full flex-col gap-2 overflow-auto bg-background',
          )}
        >
          <div className="flex gap-4">
            <span className="w-30">Buttons</span>
            <Button color="neutral">Neutral</Button>
            <Button color="brand">Brand</Button>
            <Button color="red">Red</Button>
            <Button color="pink">Pink</Button>
            <Button color="purple">Purple</Button>
            <Button color="blue">Blue</Button>
            <Button color="cyan">Cyan</Button>
            <Button color="lime">Lime</Button>
            <Button color="green">Green</Button>
            <Button color="yellow">Yellow</Button>
            <Button color="orange">Orange</Button>
          </div>
          <div className="flex gap-4">
            <span className="w-30">Buttons Tran</span>
            <Button color="neutral" variant="transparent">
              Neutral
            </Button>
            <Button variant="transparent" color="brand">
              Brand
            </Button>
            <Button variant="transparent" color="red">
              Red
            </Button>
            <Button variant="transparent" color="pink">
              Pink
            </Button>
            <Button variant="transparent" color="purple">
              Purple
            </Button>
            <Button variant="transparent" color="blue">
              Blue
            </Button>
            <Button variant="transparent" color="cyan">
              Cyan
            </Button>
            <Button variant="transparent" color="lime">
              Lime
            </Button>
            <Button variant="transparent" color="green">
              Green
            </Button>
            <Button variant="transparent" color="yellow">
              Yellow
            </Button>
            <Button variant="transparent" color="orange">
              Orange
            </Button>
          </div>
          <div className="flex gap-4">
            <span className="w-30">Buttons Fill</span>
            <Button variant="gradient-fill" color="neutral">
              Neutral
            </Button>
            <Button variant="gradient-fill" color="brand">
              Brand
            </Button>
            <Button variant="gradient-fill" color="red">
              Red
            </Button>
            <Button variant="gradient-fill" color="pink">
              Pink
            </Button>
            <Button variant="gradient-fill" color="purple">
              Purple
            </Button>
            <Button variant="gradient-fill" color="blue">
              Blue
            </Button>
            <Button variant="gradient-fill" color="cyan">
              Cyan
            </Button>
            <Button variant="gradient-fill" color="lime">
              Lime
            </Button>
            <Button variant="gradient-fill" color="green">
              Green
            </Button>
            <Button variant="gradient-fill" color="yellow">
              Yellow
            </Button>
            <Button variant="gradient-fill" color="orange">
              Orange
            </Button>
          </div>
          <Surface variant="gradient" outline className="w-fit rounded-3xl">
            <div className="flex flex-col gap-2 p-4">
              <div className="flex gap-4">
                <span className="w-30">Buttons</span>
                <Button color="neutral">Neutral</Button>
                <Button color="brand">Brand</Button>
                <Button color="red">Red</Button>
                <Button color="pink">Pink</Button>
                <Button color="purple">Purple</Button>
                <Button color="blue">Blue</Button>
                <Button color="cyan">Cyan</Button>
                <Button color="lime">Lime</Button>
                <Button color="green">Green</Button>
                <Button color="yellow">Yellow</Button>
                <Button color="orange">Orange</Button>
              </div>
              <div className="flex gap-4">
                <span className="w-30">Buttons Tran</span>
                <Button color="" variant="transparent">
                  Neutral
                </Button>
                <Button variant="transparent" color="brand">
                  Brand
                </Button>
                <Button variant="transparent" color="red">
                  Red
                </Button>
                <Button variant="transparent" color="pink">
                  Pink
                </Button>
                <Button variant="transparent" color="purple">
                  Purple
                </Button>
                <Button variant="transparent" color="blue">
                  Blue
                </Button>
                <Button variant="transparent" color="cyan">
                  Cyan
                </Button>
                <Button variant="transparent" color="lime">
                  Lime
                </Button>
                <Button variant="transparent" color="green">
                  Green
                </Button>
                <Button variant="transparent" color="yellow">
                  Yellow
                </Button>
                <Button variant="transparent" color="orange">
                  Orange
                </Button>
              </div>
              <div className="flex gap-4">
                <span className="w-30">Buttons Fill</span>
                <Button variant="gradient-fill" color="neutral">
                  Neutral
                </Button>
                <Button variant="gradient-fill" color="brand">
                  Brand
                </Button>
                <Button variant="gradient-fill" color="red">
                  Red
                </Button>
                <Button variant="gradient-fill" color="pink">
                  Pink
                </Button>
                <Button variant="gradient-fill" color="purple">
                  Purple
                </Button>
                <Button variant="gradient-fill" color="blue">
                  Blue
                </Button>
                <Button variant="gradient-fill" color="cyan">
                  Cyan
                </Button>
                <Button variant="gradient-fill" color="lime">
                  Lime
                </Button>
                <Button variant="gradient-fill" color="green">
                  Green
                </Button>
                <Button variant="gradient-fill" color="yellow">
                  Yellow
                </Button>
                <Button variant="gradient-fill" color="orange">
                  Orange
                </Button>
              </div>
              <div className="flex gap-4">
                <span className="w-30">Buttons XL</span>
                <Button size="xl" contentClassName="px-4" color="neutral">
                  Neutral
                </Button>
                <Button size="xl" contentClassName="px-4" color="brand">
                  Brand
                </Button>
                <Button size="xl" contentClassName="px-4" color="red">
                  Red
                </Button>
                <Button size="xl" contentClassName="px-4" color="pink">
                  Pink
                </Button>
                <Button size="xl" contentClassName="px-4" color="purple">
                  Purple
                </Button>
                <Button size="xl" contentClassName="px-4" color="blue">
                  Blue
                </Button>
                <Button size="xl" contentClassName="px-4" color="cyan">
                  Cyan
                </Button>
                <Button size="xl" contentClassName="px-4" color="lime">
                  Lime
                </Button>
                <Button size="xl" contentClassName="px-4" color="green">
                  Green
                </Button>
                <Button size="xl" contentClassName="px-4" color="yellow">
                  Yellow
                </Button>
                <Button size="xl" contentClassName="px-4" color="orange">
                  Orange
                </Button>
              </div>
            </div>
          </Surface>
          <div className="flex gap-4">
            <span className="w-30 shrink-0">Surfaces</span>
            {[
              'neutral',
              'brand',
              'red',
              'pink',
              'purple',
              'blue',
              'cyan',
              'lime',
              'green',
              'yellow',
              'orange',
            ].map((color) => (
              <Surface
                key={Math.random()}
                // variant="gradient"
                outline
                className="rounded-3xl text-xs"
                contentClassName="p-4"
                color={color}
              >
                <BlockTitle className="mb-4 text-[10px] whitespace-nowrap">
                  Surface {color}: 1
                </BlockTitle>
                <SurfaceCut
                  className="mb-2 rounded-full"
                  outline
                  contentClassName="p-4"
                />
                <Surface
                  // variant="gradient"
                  outline
                  className="rounded-3xl"
                  contentClassName="p-4"
                  color={color}
                >
                  <BlockTitle className="mb-4 text-[10px] whitespace-nowrap">
                    Surface {color}: 2
                  </BlockTitle>
                  <div className="mb-1 bg-surface-prev p-1">Prev</div>
                  <div className="mb-1 bg-surface-minus p-1">Minus</div>
                  <div className="mb-1 bg-surface p-1">Current</div>
                  <div className="mb-1 bg-surface-plus p-1">Plus</div>
                  <div className="mb-1 bg-surface-next p-1">Next</div>
                  <SurfaceCut
                    className="mb-2 rounded-full"
                    outline
                    contentClassName="p-4"
                  />
                  <Surface
                    // variant="gradient"
                    outline
                    className="rounded-3xl"
                    contentClassName="p-4"
                    color={color}
                  >
                    <BlockTitle className="mb-4 text-[10px] whitespace-nowrap">
                      Surface {color}: 3
                    </BlockTitle>
                    <div className="mb-1 bg-surface-prev p-1">Prev</div>
                    <div className="mb-1 bg-surface-minus p-1">Minus</div>
                    <div className="mb-1 bg-surface p-1">Current</div>
                    <div className="mb-1 bg-surface-plus p-1">Plus</div>
                    <div className="mb-1 bg-surface-next p-1">Next</div>
                    <SurfaceCut
                      className="mb-2 rounded-full"
                      outline
                      contentClassName="p-4"
                    />
                    <Surface
                      // variant="gradient"
                      outline
                      className="rounded-3xl"
                      contentClassName="p-4"
                      color={color}
                    >
                      <BlockTitle className="mb-4 text-[10px] whitespace-nowrap">
                        Surface {color}: 4
                      </BlockTitle>
                      <div className="mb-1 bg-surface-prev p-1">Prev</div>
                      <div className="mb-1 bg-surface-minus p-1">Minus</div>
                      <div className="mb-1 bg-surface p-1">Current</div>
                      <div className="mb-1 bg-surface-plus p-1">Plus</div>
                      <div className="mb-1 bg-surface-next p-1">Next</div>
                      <SurfaceCut
                        className="mb-2 rounded-full"
                        outline
                        contentClassName="p-4"
                      />
                      <Surface
                        // variant="gradient"
                        outline
                        className="rounded-3xl"
                        contentClassName="p-4"
                        color={color}
                      >
                        <BlockTitle className="mb-4 text-[10px] whitespace-nowrap">
                          Surface {color}: 5
                        </BlockTitle>
                        <div className="mb-1 bg-surface-prev p-1">Prev</div>
                        <div className="mb-1 bg-surface-minus p-1">Minus</div>
                        <div className="mb-1 bg-surface p-1">Current</div>
                        <div className="mb-1 bg-surface-plus p-1">Plus</div>
                        <div className="mb-1 bg-surface-next p-1">Next</div>
                        <SurfaceCut
                          className="mb-2 rounded-full"
                          outline
                          contentClassName="p-4"
                        />
                      </Surface>
                    </Surface>
                  </Surface>
                </Surface>
              </Surface>
            ))}
          </div>
        </div>
        <div className="flex gap-8">
          <ToastTest />
          <DialogTest />
        </div>

        <div className="flex gap-8">
          <Button size="2xl">
            Sasd
            <Surface variant="gradient" contentClassName="p-2 px-4">
              S
            </Surface>
          </Button>
        </div>

        <BlockTitle>Preloaders</BlockTitle>
        <Surface
          contentClassName={
            'flex p-4 flex-col gap-4 justify-center items-start '
          }
          outline
          className="rounded-3xl"
        >
          {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
            <div className="flex items-center gap-4">
              <span className="font-mono">{size.toUpperCase()}:</span>
              <Preloader size={size as PreloaderSize} />
              <Button size={size as ButtonSize}>
                Button <Preloader size={size as PreloaderSize} />
              </Button>
            </div>
          ))}
        </Surface>
        <BlockTitle>Select</BlockTitle>
        <Surface
          contentClassName={
            'flex p-4 flex-col gap-4 justify-center items-center '
          }
          outline
          className="rounded-3xl"
        >
          <Select
            rounded
            title="Select an option"
            value={selectValue}
            options={Array.from({ length: 50 }).map(
              (_, i) =>
                `OptionOptionOptionOptionOptionOption OptionOptionOption ${i + 1}`,
            )}
            search
            valueClassName="truncate"
            icon={<Icon />}
            onChange={(v) => setSelectValue(v as string)}
            placeholder="Choose an option"
          >
            {selectValue}
          </Select>
        </Surface>
        <BlockTitle>Modals</BlockTitle>
        <Surface
          contentClassName={
            'flex p-4 flex-col gap-4 justify-center items-center '
          }
          outline
          variant="gradient"
          className="rounded-3xl"
        >
          <PopoverRoot>
            <PopoverTrigger>
              <WithTooltip tooltip="Ta-da">
                <Button rounded surfaceLevel={1}>
                  Open Popover
                </Button>
              </WithTooltip>
            </PopoverTrigger>

            <Popover offset={['-50%', 16]} position="bottom-end">
              <List>
                <BlockTitle className="px-2 pt-2 pb-2">Block Title</BlockTitle>
                <ListItem>
                  <Radio checked /> Item 1
                </ListItem>
                <ListItem>
                  <Checkbox checked /> Item 2
                </ListItem>
                <ListSeparator />
                <ListItem>Item 3</ListItem>
                <ListItem>Item 4</ListItem>
                <ListSeparator />
                <BlockTitle className="p-2">Block Title</BlockTitle>
                <ListButton
                  header="Header text"
                  footer="Footer text"
                  icon={<Icon />}
                >
                  Button 1
                </ListButton>

                <ListButton icon={<svg className="size-4 shrink-0" />}>
                  Button 2
                </ListButton>
                <ListButton icon={<svg className="size-4 shrink-0" />}>
                  Button 3
                </ListButton>
                <ListButton icon={<svg className="size-4 shrink-0" />}>
                  Button 4
                </ListButton>
                <ListButton icon={<svg className="size-4 shrink-0" />}>
                  Button 5
                </ListButton>
                <ListButton
                  header="Header text"
                  footer="Footer text"
                  icon={<Icon />}
                >
                  Button 1
                </ListButton>
              </List>
            </Popover>
          </PopoverRoot>

          <PopoverRoot>
            <PopoverTrigger>
              <Button rounded surfaceLevel={1}>
                Open Popover (compound)
              </Button>
            </PopoverTrigger>
            <Popover position="bottom-end" offset={4}>
              <List>
                <ListItem>Compound Item 1</ListItem>
                <ListItem>Compound Item 2</ListItem>
                <ListItem>Compound Item 3</ListItem>
              </List>
            </Popover>
          </PopoverRoot>
          <DialogRoot>
            <DialogTrigger>
              <Button rounded surfaceLevel={1}>
                Open Dialog
              </Button>
            </DialogTrigger>
            <Dialog
              title="Tada"
              text="Hello this is the text here Hello this is the text here Hello this is the text here"
              requireConfirmText="TADA"
              cancelButtonText="Cancel"
              confirmButtonText="Confirm"
            >
              <DialogClose>
                <Button>Close</Button>
              </DialogClose>
            </Dialog>
          </DialogRoot>
          <PopupRoot>
            <PopupTrigger>
              <WithTooltip tooltip="Popup">
                <Button>Open Popup</Button>
              </WithTooltip>
            </PopupTrigger>
            <Popup
              headerLeft="Some Project"
              headerRight={
                <Surface
                  className={'rounded-full'}
                  contentClassName={'p-1 '}
                  outline
                  variant="gradient"
                  level={1}
                >
                  <Button rounded variant="transparent" outline={false}>
                    <Icon />
                  </Button>
                  <Button rounded variant="transparent" outline={false}>
                    <Icon />
                  </Button>
                  <Button rounded variant="transparent" outline={false}>
                    <Icon />
                  </Button>
                </Surface>
              }
            >
              <PopupContent contentClassName="flex flex-col gap-2">
                <PopupClose>
                  <Button>Close</Button>
                </PopupClose>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-on-surface-darker">
                    PROJ-45
                  </span>
                  <div className={'flex items-center gap-1'}>
                    <Select
                      optionToggleColor={() => 'red'}
                      options={['S1', 'S2', 'S3']}
                      rounded
                      color="green"
                      value="S1"
                    >
                      In Progress
                    </Select>
                    <Toggle size="md" />
                  </div>
                </div>
                <div className="font-base h-16 font-bold">Task Title</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input rounded placeholder="asd" />
                  <Button size="lg" rounded contentClassName={'justify-start'}>
                    <Icon /> Prop 2
                  </Button>
                  <Button size="lg" rounded contentClassName={'justify-start'}>
                    <Icon /> Prop 3
                  </Button>
                  <Button size="lg" rounded contentClassName={'justify-start'}>
                    <Icon /> Prop 4
                  </Button>
                </div>
              </PopupContent>
              <PopupContent>
                Tada 2 Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Delectus quam natus facilis. Rem ut dignissimos laborum
                molestias laboriosam soluta quidem ad, quia optio ea doloremque
                quibusdam obcaecati quod nam voluptas.
              </PopupContent>
              <PopupContent>
                Tada 3 Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Impedit laboriosam nesciunt repudiandae voluptatum nobis quia
                voluptatem minima alias, neque nisi eum rem quae accusamus
                placeat modi voluptate dolor! Dolorem, fugit.
              </PopupContent>
              <PopupContent>
                Tada 4 Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aliquam, deserunt ea laudantium, numquam sint, perspiciatis
                quisquam quo voluptatibus excepturi ullam repellat enim sapiente
                blanditiis. Harum fugiat officiis tenetur cupiditate aliquam!
              </PopupContent>
              <PopupContent>
                Tada 5. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ea quaerat assumenda tempore quam perferendis culpa magni?
                Quibusdam aliquid assumenda error, voluptatibus optio accusamus
                laborum natus! Aspernatur, veritatis! Dolorum, quis eligendi.
              </PopupContent>
            </Popup>
          </PopupRoot>
        </Surface>
        <BlockTitle>Surfaces</BlockTitle>
        <div className="flex flex-col gap-4">
          <Surface className="rounded-full p-4" variant="transparent">
            Surface Transparent
          </Surface>
          <Surface className="rounded-full p-4" variant="solid">
            Surface Solid
          </Surface>
          <Surface className="rounded-full p-4" variant="gradient">
            Surface Gradient
          </Surface>
          <Surface className="rounded-full p-4" variant="transparent" outline>
            Surface Outline Transparent
          </Surface>
          <Surface className="rounded-full p-4" variant="solid" outline>
            Surface Outline Solid
          </Surface>
          <Surface className="rounded-full p-4" variant="gradient" outline>
            Surface Outline Gradient
          </Surface>
        </div>

        <BlockTitle>OTPField</BlockTitle>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4 items-start'}
          outline
          className="rounded-3xl"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">SM:</span>
            <OTPField size="sm" value={otp} onChange={setOtp}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">MD:</span>
            <OTPField size="md" value={otp} onChange={setOtp}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">LG:</span>
            <OTPField size="lg" value={otp} onChange={setOtp}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">XL:</span>
            <OTPField size="xl" value={otp} onChange={setOtp}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">2XL:</span>
            <OTPField size="2xl" value={otp} onChange={setOtp}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">Grouped:</span>
            <OTPField size="lg" value={otpGrouped} onChange={setOtpGrouped}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldSeparator />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
            <span className="font-mono text-xs">{otpGrouped || ' '}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">Invalid:</span>
            <OTPField size="lg" value={otp} onChange={setOtp} valid={false}>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">Disabled:</span>
            <OTPField size="lg" value="42" onChange={() => {}} disabled>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">ReadOnly:</span>
            <OTPField size="lg" value="42" onChange={() => {}} readOnly>
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs">Alpha:</span>
            <OTPField
              size="lg"
              pattern="[A-Za-z0-9]"
              inputMode="text"
              value={otpAlpha}
              onChange={(v) => setOtpAlpha(v.toUpperCase())}
            >
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldSeparator />
              <OTPFieldInput />
              <OTPFieldInput />
              <OTPFieldInput />
            </OTPField>
          </div>
        </Surface>
        <BlockTitle>NumberField</BlockTitle>
        <Surface
          contentClassName={
            'flex p-4 flex-col gap-4 justify-center items-center '
          }
          outline
          className="rounded-3xl"
        >
          <NumberField size="sm" input={true} value={10} rounded={false} />

          <NumberField input={true} value={10} rounded={false} />

          <NumberField size="lg" input={true} value={10} rounded={false} />

          <NumberField size="xl" input={true} value={10} rounded={false} />

          <NumberField size="2xl" input={true} value={10} rounded={false} />
        </Surface>
        <BlockTitle>Segmented</BlockTitle>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4'}
          outline
          className="rounded-3xl"
        >
          <Segmented activeColor="neutral">
            <SegmentedButton active={active === 0} onClick={() => setActive(0)}>
              Button 1
            </SegmentedButton>
            <SegmentedButton active={active === 1} onClick={() => setActive(1)}>
              Button 2
            </SegmentedButton>
            <SegmentedButton active={active === 2} onClick={() => setActive(2)}>
              Button 3
            </SegmentedButton>
          </Segmented>
        </Surface>
        <BlockTitle>Range Slider</BlockTitle>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4'}
          outline
          className="rounded-3xl"
        >
          <Range />
          <Range readOnly />
          <Range disabled value={50} />
        </Surface>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4'}
          outline
          className="rounded-3xl"
        >
          <div className="flex items-center gap-8">
            <Toggle disabled />
            <Toggle disabled checked />
            <Toggle checked={checked} onChange={setChecked} />
            <Button size="md">Button MD</Button>
            <Surface
              contentClassName="p-1 flex items-center"
              outline
              className={'self-start rounded-full'}
              variant="gradient"
            >
              <Button rounded variant="transparent" outline={false}>
                Test
              </Button>
              <Button rounded variant="transparent" outline={false}>
                <Icon />
              </Button>
              <Toggle checked={checked} onChange={setChecked} />
            </Surface>
          </div>
        </Surface>
        <BlockTitle>Checkboxes and radios</BlockTitle>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4'}
          outline
          className="rounded-3xl"
        >
          <div className="flex gap-8">
            <Checkbox checked={checked} onChange={setChecked} />
            <Checkbox disabled onChange={setChecked} />
            <Checkbox disabled checked={checked} onChange={setChecked} />
            <Checkbox readOnly onChange={setChecked} />
            <Checkbox readOnly checked={checked} onChange={setChecked} />
          </div>
          <div className="flex gap-8">
            <Radio checked={checked} onChange={setChecked} />
            <Radio disabled onChange={setChecked} />
            <Radio disabled checked={checked} onChange={setChecked} />
            <Radio readOnly onChange={setChecked} />
            <Radio readOnly checked={checked} onChange={setChecked} />
          </div>
        </Surface>
        <BlockTitle>Links</BlockTitle>
        <Surface
          contentClassName={'flex p-4 flex-col gap-4'}
          outline
          className="rounded-3xl"
        >
          <div className="flex gap-8">
            <Link>Link 1</Link>
          </div>
        </Surface>

        <div className="flex flex-col gap-4">
          <BlockTitle>Toolbar Transparent</BlockTitle>
          <Surface
            contentClassName="p-1 h-9 flex items-center"
            className="rounded-full"
            outline
            variant="transparent"
          >
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              Board
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              List
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              level={3}
              contentClassName="flex items-center px-2.5"
            >
              Calendar
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              Gantt
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              <div className="size-4 rounded-full bg-white/30" />
            </Surface>
          </Surface>
          <BlockTitle>Toolbar Solid</BlockTitle>
          <Surface
            contentClassName="p-1 h-9 flex items-center"
            className="rounded-full"
            outline
            variant="solid"
            level={1}
          >
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              Board
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              List
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              level={'+2'}
              contentClassName="flex items-center px-2.5"
            >
              Calendar
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              contentClassName="flex items-center px-2.5"
            >
              Gantt
            </Surface>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              <div className="size-4 rounded-full bg-white/30" />
            </Surface>
          </Surface>
          <BlockTitle>Toolbar Gradient</BlockTitle>
          <Surface
            contentClassName="p-1 h-9 flex items-center"
            className="rounded-full"
            outline
            variant="gradient"
            level={1}
          >
            <Button rounded variant="transparent" outline={false}>
              <Icon />
            </Button>
            <Button rounded variant="transparent" outline={false}>
              <Icon />
            </Button>
            <Button color="brand" variant="gradient-fill" rounded readOnly>
              <Icon />
              Calendar
            </Button>
            <Button rounded>Gantt</Button>
            <Surface
              className="h-7 cursor-default rounded-full text-xs"
              hoverable
              clickable
              // variant="transparent"
              contentClassName="flex items-center px-2.5"
            >
              <div className="size-4 rounded-full bg-white/30" />
            </Surface>
          </Surface>
        </div>
        <BlockTitle>Buttons</BlockTitle>
        <Surface
          outline
          className="rounded-3xl"
          contentClassName="p-4 flex flex-col gap-4"
          level={1}
        >
          <div className="flex items-center gap-2">
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
        </Surface>

        <BlockTitle>Chips</BlockTitle>
        <Surface
          outline
          className="rounded-3xl"
          contentClassName="p-4 flex gap-2 flex-wrap"
          level={1}
        >
          <Chip size="sm" rounded clickable color="green">
            Chip SM
          </Chip>

          <Chip size="sm" outline rounded clickable color="green">
            Chip SM
          </Chip>
          <Chip size="sm" outline rounded clickable color="green">
            <Icon />
            Chip SM
          </Chip>
          <Chip
            size="md"
            color="red"
            // outline
            rounded
            clickable
          >
            <Icon />
            Chip MD
          </Chip>

          <Chip size="md" color="red" outline rounded clickable>
            <Icon />
            Chip MD
          </Chip>
          <Chip
            size="md"
            // outline
            rounded
            clickable
          >
            <Icon />
            Chip MD
          </Chip>

          <Chip size="md" outline rounded clickable>
            <Icon />
            Chip MD
          </Chip>

          <Chip size="md" outline rounded clickable color="green">
            Chip MD
          </Chip>
          <Chip size="md" outline rounded clickable color="green">
            <Icon />
            Chip MD
          </Chip>
          <Chip size="lg" outline rounded clickable color="green">
            Chip LG
          </Chip>
          <Chip size="lg" outline rounded clickable color="green">
            <Icon />
            Chip LG
          </Chip>
          <Chip size="xl" outline rounded clickable color="green">
            <Icon />
            Chip XL
          </Chip>
          <Chip size="2xl" outline rounded clickable color="green">
            <Icon />
            Chip 2XL
          </Chip>
        </Surface>
        <BlockTitle>Chips In Buttons</BlockTitle>
        <Surface
          outline
          className="rounded-3xl"
          contentClassName="p-4 flex gap-2 flex-wrap"
          level={1}
        >
          <Button size="sm" color="red" rounded>
            SM
            <Chip size="sm" rounded>
              CHIP
            </Chip>
          </Button>
          <Button size="md">
            MD
            <Chip size="md">CHIP</Chip>
          </Button>

          <Button size="lg">
            LG
            <Chip size="lg">CHIP</Chip>
          </Button>
          <Button size="xl">
            XL
            <Chip size="xl">CHIP</Chip>
          </Button>
          <Button size="2xl">
            2XL
            <Chip size="2xl">CHIP</Chip>
          </Button>
        </Surface>
        <BlockTitle>Inputs</BlockTitle>
        <Surface
          contentClassName="p-4 grid grid-cols-3 gap-4"
          className="rounded-3xl"
          outline
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">SM:</span>
              <Button size="sm">Button</Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">SM:</span>
              <Input
                infoMessage="Tadamba parapamba"
                size="sm"
                value="5"
                clearButton
                displayValue="$5"
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Button size="md">Button</Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Input
                infoMessage="Tadamba parapamba"
                size="md"
                value="Ta-da"
                readOnly
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Button size="lg">Button</Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Input size="lg" value="Ta-da" clearButton></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Button size="xl">Button</Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Input size="xl" value="Ta-da" clearButton></Input>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Surface
                contentClassName="p-1"
                outline
                className={'rounded-full'}
                variant="gradient"
              >
                <Button rounded size="sm" variant="transparent" outline={false}>
                  <Icon />
                  Button
                </Button>
              </Surface>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Input
                icon={<Icon />}
                rounded
                size="md"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Surface
                contentClassName="p-1"
                outline
                className={'rounded-full'}
                variant="gradient"
              >
                <Button rounded size="md" variant="transparent" outline={false}>
                  <Icon />
                  Button
                </Button>
              </Surface>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Input
                icon={<Icon />}
                rounded
                size="lg"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Surface
                contentClassName="p-1"
                outline
                className={'rounded-full'}
                variant="gradient"
              >
                <Button rounded size="lg" variant="transparent" outline={false}>
                  <Icon />
                  Button
                </Button>
              </Surface>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Input
                icon={<Icon />}
                rounded
                size="xl"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">SM:</span>
              <Button size="sm">
                <Icon />
                Button
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">SM:</span>
              <Input
                icon={<Icon />}
                size="sm"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Button size="md">
                <Icon />
                Button
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">MD:</span>
              <Input
                icon={<Icon />}
                size="md"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Button size="lg">
                <Icon />
                Button
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">LG:</span>
              <Input
                icon={<Icon />}
                size="lg"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Button size="xl">
                <Icon />
                Button
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">XL:</span>
              <Input
                icon={<Icon />}
                size="xl"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">2XL:</span>
              <Button
                size="2xl"
                variant="solid"
                className="duration-200"
                outline={false}
              >
                <Icon />
                Button
              </Button>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono leading-none">2XL:</span>
              <Input
                icon={<Icon />}
                size="2xl"
                value="Ta-da"
                clearButton
              ></Input>
            </div>
          </div>
        </Surface>
        <BlockTitle>TextAreas</BlockTitle>
        <Surface
          className="rounded-3xl"
          outline
          contentClassName="p-4 flex flex-col gap-4"
        >
          <Input
            disabled
            icon={<Icon />}
            placeholder="MD: Add text"
            size="md"
          />
          <TextArea
            disabled
            icon={<Icon />}
            placeholder="MD: Add text"
            size="md"
          />
          <Input icon={<Icon />} placeholder="LG: Add text" size="lg" />
          <TextArea icon={<Icon />} placeholder="LG: Add text" size="lg" />
          <Input icon={<Icon />} placeholder="XL: Add text" size="xl" />
          <TextArea icon={<Icon />} placeholder="XL: Add text" size="xl" />
          <Input icon={<Icon />} placeholder="2XL: Add text" size="2xl" />
          <TextArea icon={<Icon />} placeholder="2XL: Add text" size="2xl" />
          <TextArea
            icon={<Icon />}
            placeholder="Rounded MD: Add text"
            size="md"
            rounded
          />
          <TextArea
            icon={<Icon />}
            placeholder="Rounded LG: Add text"
            size="lg"
            rounded
          />
          <TextArea
            icon={<Icon />}
            placeholder="Rounded XL: Add text"
            size="xl"
            rounded
          />
          <TextArea
            icon={<Icon />}
            placeholder="Rounded 2XL: Add text"
            size="2xl"
            rounded
          />
        </Surface>
        <BlockTitle>Sizes</BlockTitle>
        <Surface
          contentClassName="p-4 flex flex-col gap-4"
          className="rounded-3xl"
          outline
        >
          <div className="flex items-center gap-2">
            <div>SM:</div>
            <Button size="sm">Button</Button>
            <Input icon={<Icon />} size="sm" value="Ta-da" clearButton></Input>
            <TextArea icon={<Icon />} size="sm" value="Ta-da" rounded />

            <Toggle size="sm" />
            <Checkbox size="sm" />
            <Radio size="sm" />
            <Range size="sm" />
            <Chip size="sm">Chip</Chip>
          </div>
          <div className="flex items-center gap-2">
            <div>MD:</div>
            <Button size="md">Button</Button>
            <Input size="md" value="Ta-da" clearButton></Input>
            <TextArea size="md" value="Ta-da" rounded />

            <Toggle size="md" />
            <Checkbox size="md" />
            <Radio size="md" />
            <Range size="md" />
            <Chip size="md">Chip</Chip>
          </div>
          <div className="flex items-center gap-2">
            <div>LG:</div>
            <Button size="lg">Button</Button>
            <Input size="lg" value="Ta-da" clearButton></Input>
            <TextArea size="lg" value="Ta-da" />

            <Toggle size="md" />
            <Checkbox size="md" />
            <Radio size="md" />
            <Range size="md" />
            <Chip size="lg">Chip</Chip>
          </div>
          <div className="flex items-center gap-2">
            <div>XL:</div>
            <Button size="xl">Button</Button>
            <Input size="xl" value="Ta-da" clearButton></Input>
            <TextArea size="xl" value="Ta-da" />

            <Toggle size="md" />
            <Checkbox size="md" />
            <Radio size="md" />
            <Range size="md" />
            <Chip size="xl">Chip</Chip>
          </div>
          <div className="flex items-center gap-2">
            <div>2XL:</div>
            <Button size="2xl">Button</Button>
            <Input size="2xl" value="Ta-da" clearButton></Input>
            <TextArea size="2xl" value="Ta-da" />

            <Toggle size="md" />
            <Checkbox size="md" />
            <Radio size="md" />
            <Range size="md" />
            <Chip size="2xl">Chip</Chip>
          </div>
        </Surface>

        <BlockTitle>Nested + Colors</BlockTitle>
        <div className="h-px w-full shrink-0 bg-background-outline" />
        <div className="flex justify-start gap-8">
          {[
            'neutral',
            'brand',
            'red',
            'pink',
            'purple',
            'blue',
            'cyan',
            'lime',
            'green',
            'yellow',
            'orange',
          ].map((color) => (
            <Surface
              className="w-90 shrink-0 rounded-3xl"
              contentClassName={'flex flex-col gap-4 p-4'}
              variant="solid"
              outline
              color={color}
            >
              <div>Surface 1</div>
              <div className="text-on-surface-dark">
                Surface 1 On Surface Dark
              </div>
              <div className="text-on-surface-darker">
                Surface 1 On Surface Darker
              </div>
              <div className="h-px bg-surface-outline" />
              <div className="text-on-surface-darkest">
                Surface 1 On Surface Darkest
              </div>
              <SurfaceCut hoverable clickable className="rounded-xl p-4">
                Surface Cut
                <Surface
                  className="rounded-3xl"
                  outline
                  contentClassName="p-4 mt-4"
                  variant="gradient"
                >
                  Tada
                </Surface>
              </SurfaceCut>
              <Surface
                className="rounded-3xl"
                contentClassName={'flex flex-col gap-4 p-4'}
                variant="solid"
                outline
              >
                <div>Surface 2</div>
                <div className="text-on-surface-dark">
                  Surface 1 On Surface Dark
                </div>
                <div className="text-on-surface-darker">
                  Surface 1 On Surface Darker
                </div>
                <div className="h-px bg-surface-outline" />
                <div className="text-on-surface-darkest">
                  Surface 1 On Surface Darkest
                </div>
                <SurfaceCut hoverable clickable className="rounded-xl p-4">
                  Surface Cut
                </SurfaceCut>

                <Surface
                  className="rounded-3xl"
                  contentClassName={'flex flex-col gap-4 p-4'}
                  // variant="gradient"
                  outline
                >
                  <div>Surface 3</div>
                  <div className="text-on-surface-dark">
                    Surface 1 On Surface Dark
                  </div>
                  <div className="text-on-surface-darker">
                    Surface 1 On Surface Darker
                  </div>
                  <div className="h-px bg-surface-outline" />
                  <div className="text-on-surface-darkest">
                    Surface 1 On Surface Darkest
                  </div>
                  <SurfaceCut hoverable clickable className="rounded-xl p-4">
                    Surface Cut
                  </SurfaceCut>
                  <Surface
                    className="rounded-3xl"
                    contentClassName={'flex flex-col gap-4 p-4'}
                    // variant="gradient"
                    outline
                  >
                    <div>Surface 4</div>
                    <div className="text-on-surface-dark">
                      Surface 1 On Surface Dark
                    </div>
                    <div className="text-on-surface-darker">
                      Surface 1 On Surface Darker
                    </div>
                    <div className="h-px bg-surface-outline" />
                    <div className="text-on-surface-darkest">
                      Surface 1 On Surface Darkest
                    </div>
                    <SurfaceCut hoverable clickable className="rounded-xl p-4">
                      Surface Cut
                    </SurfaceCut>
                    <Surface
                      className="rounded-3xl"
                      contentClassName={'flex flex-col gap-4 p-4'}
                      // variant="gradient"
                      outline
                      hoverable
                      clickable
                    >
                      <div>Surface 5</div>
                      <div className="text-on-surface-dark">
                        Surface 1 On Surface Dark
                      </div>
                      <div className="text-on-surface-darker">
                        Surface 1 On Surface Darker
                      </div>
                      <div className="h-px bg-surface-outline" />
                      <div className="text-on-surface-darkest">
                        Surface 1 On Surface Darkest
                      </div>
                      <SurfaceCut
                        hoverable
                        clickable
                        className="rounded-xl p-4"
                      >
                        Surface Cut
                      </SurfaceCut>
                    </Surface>
                  </Surface>
                </Surface>
              </Surface>
            </Surface>
          ))}
        </div>
      </div>
    </UIProvider>
  );
}

export default App;
