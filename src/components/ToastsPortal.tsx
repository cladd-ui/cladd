import { Toast } from './Toast';
import { useToastsPortalContext } from './ToastsPortalContext';

export function ToastsPortal() {
  const { data, state, setState, setData } = useToastsPortalContext();
  if (!data) return null;
  return (
    <>
      {data.map((toast) => (
        <Toast
          open={state[toast.id]}
          onOpenChange={(newState) =>
            setState({ ...state, [toast.id]: newState })
          }
          key={toast.id}
          title={toast.title}
          text={toast.text}
          closeButton={toast.closeButton}
          icon={toast.icon}
          iconComponent={toast.iconComponent}
          color={toast.color}
          timeout={toast.timeout}
          className={toast.className}
          onClosed={() => {
            if (toast.removed) return;
            toast.removed = true;
            data.splice(data.indexOf(toast), 1);
            setData([...data]);
            toast.onClosed?.(false);
          }}
        />
      ))}
    </>
  );
}
