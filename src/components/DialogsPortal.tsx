import { Dialog } from './Dialog';
import { useDialogsPortalContext } from './DialogsPortalContext';

export function DialogsPortal() {
  const { data, state, setState, setData } = useDialogsPortalContext();
  if (!data) return null;
  return (
    <Dialog
      open={state}
      onOpenChange={setState}
      lazy={data.lazy}
      title={data.title}
      text={data.text}
      stopPropagationOnClick={data.stopPropagationOnClick}
      requireConfirmText={
        data.requireConfirmText ? String(data.requireConfirmText) : undefined
      }
      cancelButtonText={data.cancelButtonText}
      confirmButtonText={data.confirmButtonText}
      cancelButtonColor={data.cancelButtonColor}
      confirmButtonColor={data.confirmButtonColor}
      onCancel={() => {
        data.onCancel?.(false);
      }}
      onConfirm={() => {
        data.onConfirm?.(true);
      }}
      onClosed={() => {
        setData(null);
        data.onClosed?.(false);
      }}
    />
  );
}
