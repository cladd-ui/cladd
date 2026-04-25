import {
  useDialogsPortalContext,
  DialogsPortalData,
} from '../components/DialogsPortalContext';
import { useAccentColor } from './use-accent-color';

export const useDialog = ({ lazy }: { lazy?: boolean } = {}) => {
  const { setState, setData } = useDialogsPortalContext();
  const accentColor = useAccentColor();
  return {
    confirm({
      title,
      text,
      requireConfirmText = false,
      stopPropagationOnClick = false,
      cancelButtonText = 'Cancel',
      confirmButtonText = 'Confirm',
      cancelButtonColor = 'neutral',
      confirmButtonColor = accentColor,
      onConfirm = () => {},
      onCancel = () => {},
      onClosed = () => {},
    }: Partial<DialogsPortalData>) {
      setData({
        title: title!,
        text: text!,
        requireConfirmText,
        stopPropagationOnClick,
        cancelButtonColor,
        confirmButtonColor,
        onConfirm,
        onCancel,
        onClosed,
        cancelButtonText,
        confirmButtonText,
        lazy,
      });
      setState(true);
    },
    alert({
      title,
      text,
      stopPropagationOnClick = false,
      confirmButtonText = 'Ok',
      onConfirm = () => {},
      onClosed = () => {},
    }: Partial<DialogsPortalData>) {
      setData({
        title: title!,
        text: text!,
        stopPropagationOnClick,
        onConfirm,
        onClosed,
        confirmButtonText,
        lazy,
      });
      setState(true);
    },
  };
};
