import { useEffect } from 'preact/hooks';

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  className = '',
  bodyClassName = ''
}) {
  useEffect(() => {
    function onEsc(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (open) {
      window.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const modalClass = ['modal', className].filter(Boolean).join(' ');
  const modalBodyClass = ['modal-body', bodyClassName].filter(Boolean).join(' ');

  return (
    <div class="modal-backdrop" onClick={onClose}>
      <div class={modalClass} onClick={(event) => event.stopPropagation()}>
        <div class="modal-header">
          <h3>{title}</h3>
          <button class="icon-btn" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <div class={modalBodyClass}>{children}</div>
        {footer ? <div class="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
