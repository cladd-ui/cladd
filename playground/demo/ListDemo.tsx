import {
  Checkbox,
  List,
  ListButton,
  ListItem,
  ListSeparator,
  ListTitle,
  Radio,
  SectionTitle,
  Surface,
} from '@cladd-ui/react';

import { Icon } from './Icon';

export default function ListDemo() {
  return (
    <>
      <SectionTitle>List</SectionTitle>
      <Surface outline className="rounded-3xl">
        <List>
          <ListTitle>List Title</ListTitle>
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
          <ListTitle>List Title</ListTitle>
          <ListButton header="Header text" footer="Footer text" icon={<Icon />}>
            Button 1
          </ListButton>
          <ListButton size="2xs" icon={<svg className="size-4 shrink-0" />}>
            Button 2 2xs
          </ListButton>
          <ListButton size="xs" icon={<svg className="size-4 shrink-0" />}>
            Button 3 xs
          </ListButton>
          <ListButton size="sm" icon={<svg className="size-4 shrink-0" />}>
            Button 4 sm
          </ListButton>
          <ListButton size="md" icon={<svg className="size-4 shrink-0" />}>
            Button 5 md
          </ListButton>
          <ListButton size="lg" icon={<svg className="size-4 shrink-0" />}>
            Button 6 lg
          </ListButton>
          <ListButton size="xl" icon={<svg className="size-4 shrink-0" />}>
            Button 7 xl
          </ListButton>
          <ListButton size="2xl" icon={<svg className="size-4 shrink-0" />}>
            Button 7 2xl
          </ListButton>
        </List>
      </Surface>
    </>
  );
}
