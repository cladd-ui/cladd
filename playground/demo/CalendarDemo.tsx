import { SectionTitle, Surface } from '@cladd-ui/react';
import { Calendar, DatePicker, type DateRange } from '@cladd-ui/react/calendar';
import { useState } from 'react';

import { Icon } from './Icon';

export default function CalendarDemo() {
  const [day, setDay] = useState<Date | undefined>(new Date());
  const [pickerDay, setPickerDay] = useState<Date | undefined>();
  const [days, setDays] = useState<Date[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <>
      <SectionTitle>Calendar &amp; DatePicker</SectionTitle>
      <Surface
        contentClassName="flex flex-wrap gap-8 p-4 items-start"
        outline
        className="rounded-3xl"
      >
        <Calendar
          size="lg"
          mode="single"
          selected={day}
          onSelect={setDay}
          header={
            <div className="flex items-center gap-2 text-cladd-sm font-semibold text-cladd-fg">
              <Icon /> Pick a date
            </div>
          }
          footer="Hello world"
        />

        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={day}
          onSelect={setDay}
        />

        <Calendar
          mode="single"
          color="orange"
          showToday={false}
          footer="showToday={false}"
        />

        <div className="flex w-56 flex-col gap-3">
          <DatePicker value={pickerDay} onChange={setPickerDay} outline />
          <DatePicker
            mode="range"
            color="purple"
            value={range}
            onChange={setRange}
            rounded
            placeholder="Select range"
            calendarProps={{ numberOfMonths: 2 }}
            outline
          />
          <DatePicker
            mode="multiple"
            color="green"
            value={days}
            onChange={setDays}
            placeholder="Select dates"
            outline
          />
        </div>
      </Surface>
    </>
  );
}
