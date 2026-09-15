import { BelvoLogo } from '@/components/open-finance/belvo-logo';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

type BelvoConnectDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function BelvoConnectDialog({ open, onConfirm, onCancel }: BelvoConnectDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Valora usa a Belvo para conectar sua conta"
      panelClassName="max-w-sm"
      header={
        <div className="flex flex-col gap-1">
          <BelvoLogo className="text-[1.35rem] text-[var(--color-text)]" />
          <p className="text-xs text-[var(--color-text-muted)]">Open Finance</p>
        </div>
      }
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} className="w-full">
            Continuar
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        Deseja conectar suas contas bancárias? A Belvo fará a conexão segura para o Valora acessar
        saldos, contas e transações com o seu consentimento.
      </p>
    </Dialog>
  );
}
