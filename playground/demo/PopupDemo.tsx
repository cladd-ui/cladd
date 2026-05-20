import {
  Button,
  Input,
  Popup,
  PopupClose,
  PopupContent,
  PopupRoot,
  PopupTrigger,
  SectionTitle,
  Select,
  Surface,
  Switch,
  Tooltip,
} from '@cladd-ui/react';

import { Icon } from './Icon';

export default function PopupDemo() {
  return (
    <>
      <SectionTitle>Popup</SectionTitle>
      <Surface
        contentClassName="flex p-4 flex-col gap-4 justify-center items-start"
        outline
        variant="gradient"
        className="rounded-3xl"
      >
        <PopupRoot>
          <PopupTrigger>
            <Tooltip tooltip="Popup">
              <Button>Open Popup</Button>
            </Tooltip>
          </PopupTrigger>
          <Popup
            headerLeft="Some Project"
            headerRight={
              <Surface
                className="rounded-full"
                contentClassName="p-1"
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
              <PopupRoot>
                <PopupTrigger>
                  <Tooltip tooltip="Popup">
                    <Button>Open Popup</Button>
                  </Tooltip>
                </PopupTrigger>
                <Popup>
                  <PopupContent>Another Popup</PopupContent>
                </Popup>
              </PopupRoot>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cladd-fg-softer">
                  PROJ-45
                </span>
                <div className="flex items-center gap-1">
                  <Select
                    optionIndicatorColor={() => 'red'}
                    options={['S1', 'S2', 'S3']}
                    rounded
                    color="green"
                    value="S1"
                  >
                    In Progress
                  </Select>
                  <Switch size="md" />
                </div>
              </div>
              <div className="font-base h-16 font-bold">Task Title</div>
              <div className="grid grid-cols-2 gap-2">
                <Input rounded placeholder="asd" />
                <Button size="lg" rounded contentClassName="justify-start">
                  <Icon /> Prop 2
                </Button>
                <Button size="lg" rounded contentClassName="justify-start">
                  <Icon /> Prop 3
                </Button>
                <Button size="lg" rounded contentClassName="justify-start">
                  <Icon /> Prop 4
                </Button>
              </div>
            </PopupContent>
            <PopupContent>
              Tada 2 Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Delectus quam natus facilis. Rem ut dignissimos laborum molestias
              laboriosam soluta quidem ad, quia optio ea doloremque quibusdam
              obcaecati quod nam voluptas.
            </PopupContent>
            <PopupContent>
              Tada 3 Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Impedit laboriosam nesciunt repudiandae voluptatum nobis quia
              voluptatem minima alias, neque nisi eum rem quae accusamus placeat
              modi voluptate dolor! Dolorem, fugit.
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
    </>
  );
}
