import {
  useToastsPortalContext,
  ToastsPortalData,
} from '../components/ToastsPortalContext';

export const useToast = () => {
  const { setState, state, setData, data } = useToastsPortalContext();
  return ({
    title,
    text,
    color,
    closeButton,
    icon,
    iconProps,
    onClosed,
  }: Partial<ToastsPortalData>) => {
    const id = Math.random().toString(36).substr(2, 9);
    data.push({
      id,
      title: title!,
      text: text!,
      color,
      closeButton,
      icon,
      iconProps,
      onClosed,
    });
    setData([...data]);
    state[id] = true;
    setState({ ...state });
  };
};
