import { CladdProvider } from '@cladd-ui/react';

import ButtonDemo from './demo/ButtonDemo';
import CalendarDemo from './demo/CalendarDemo';
import CheckboxDemo from './demo/CheckboxDemo';
import ChipDemo from './demo/ChipDemo';
import ColorsDemo from './demo/ColorsDemo';
import DialogDemo from './demo/DialogDemo';
import InputDemo from './demo/InputDemo';
import LinkDemo from './demo/LinkDemo';
import ListDemo from './demo/ListDemo';
import NumberFieldDemo from './demo/NumberFieldDemo';
import NumberScrubberDemo from './demo/NumberScrubberDemo';
import OTPFieldDemo from './demo/OTPFieldDemo';
import PopoverDemo from './demo/PopoverDemo';
import PopupDemo from './demo/PopupDemo';
import RadioDemo from './demo/RadioDemo';
import SegmentedDemo from './demo/SegmentedDemo';
import SelectDemo from './demo/SelectDemo';
import ShortcutDemo from './demo/ShortcutDemo';
import SizesDemo from './demo/SizesDemo';
import SliderDemo from './demo/SliderDemo';
import SpinnerDemo from './demo/SpinnerDemo';
import SurfaceDemo from './demo/SurfaceDemo';
import SwitchDemo from './demo/SwitchDemo';
import TabsDemo from './demo/TabsDemo';
import TextareaDemo from './demo/TextareaDemo';
import ToastDemo from './demo/ToastDemo';
import ToggleDemo from './demo/ToggleDemo';
import ToolbarDemo from './demo/ToolbarDemo';

function App() {
  return (
    <CladdProvider theme="dark">
      <div className="flex flex-col items-start gap-8 p-8 text-cladd-fg">
        <ButtonDemo />
        <CalendarDemo />
        <CheckboxDemo />
        <ChipDemo />
        <ColorsDemo />
        <DialogDemo />
        <InputDemo />
        <LinkDemo />
        <ListDemo />
        <NumberFieldDemo />
        <NumberScrubberDemo />
        <OTPFieldDemo />
        <PopoverDemo />
        <PopupDemo />
        <RadioDemo />
        <SegmentedDemo />
        <SelectDemo />
        <ShortcutDemo />
        <SizesDemo />
        <SliderDemo />
        <SpinnerDemo />
        <SurfaceDemo />
        <SwitchDemo />
        <TabsDemo />
        <TextareaDemo />
        <ToastDemo />
        <ToggleDemo />
        <ToolbarDemo />
      </div>
    </CladdProvider>
  );
}

export default App;
