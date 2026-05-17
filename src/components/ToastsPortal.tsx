import { Toast } from './Toast';
import { useToastsPortalApi, useToastsPortalData } from './ToastsPortalContext';

export function ToastsPortal() {
  const { data, state } = useToastsPortalData();
  const { setData, setState } = useToastsPortalApi();
  if (!data) return null;
  return (
    <>
      {data.map((toast) => (
        <Toast
          open={state[toast.id]}
          onOpenChange={(newState) =>
            setState((prev) => ({ ...prev, [toast.id]: newState }))
          }
          key={toast.id}
          title={toast.title}
          text={toast.text}
          closeButton={toast.closeButton}
          icon={toast.icon}
          iconProps={toast.iconProps}
          color={toast.color}
          timeout={toast.timeout}
          className={toast.className}
          onClosed={() => {
            if (toast.removed) return;
            toast.removed = true;
            setData((prev) => prev.filter((t) => t !== toast));
            toast.onClosed?.(false);
          }}
        />
      ))}
    </>
  );
}
