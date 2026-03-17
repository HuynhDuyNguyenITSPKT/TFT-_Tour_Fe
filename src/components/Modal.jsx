import { useEffect } from 'preact/hooks';

export default function Modal({ open, title, children, onClose, footer }) {
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

  return (
    <div class="modal-backdrop" onClick={onClose}>
      <div class="modal" onClick={(event) => event.stopPropagation()}>
        <div class="modal-header">
          <h3>{title}</h3>
          <button class="icon-btn" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <div class="modal-body">{children}</div>
        {footer ? <div class="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
