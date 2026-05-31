import {
  Chip,
  SectionTitle,
  Surface,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
  Toolbar,
} from '@cladd-ui/react';
import { useState } from 'react';

export default function TabsDemo() {
  const [tab, setTab] = useState('activity');
  return (
    <>
      <SectionTitle>Tabs</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-6"
        outline
        className="rounded-3xl"
      >
        {/* Uncontrolled, defaults to the first panel */}
        <Tabs defaultValue="overview">
          <Toolbar size="sm">
            <TabsList activeColor="yellow">
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">
                Activity{' '}
                <Chip size="md" color="green">
                  3
                </Chip>
              </Tab>
              <Tab value="settings">Settings</Tab>
              <Tab value="archived" disabled>
                Archived
              </Tab>
            </TabsList>
          </Toolbar>

          <TabPanel value="overview">Overview panel</TabPanel>
          <TabPanel value="activity">Activity panel</TabPanel>
          <TabPanel value="settings">Settings panel</TabPanel>
          <TabPanel value="archived">Archived panel</TabPanel>
        </Tabs>

        {/* Controlled */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList size="sm" activeColor="brand">
            <Tab value="activity">Activity</Tab>
            <Tab value="mentions">Mentions</Tab>
            <Tab value="drafts">Drafts</Tab>
          </TabsList>

          <TabPanel value="activity" keepMounted>
            Activity panel — <code>tab = "{tab}"</code>
          </TabPanel>
          <TabPanel value="mentions" keepMounted>
            Mentions panel — <code>tab = "{tab}"</code>
          </TabPanel>
          <TabPanel value="drafts" keepMounted>
            Drafts panel — <code>tab = "{tab}"</code>
          </TabPanel>
        </Tabs>
      </Surface>
    </>
  );
}
