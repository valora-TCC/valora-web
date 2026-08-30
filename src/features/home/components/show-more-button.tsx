import { Button } from '@/components/ui/button';

type ShowMoreButtonProps = {
  hiddenCount: number;
  expanded: boolean;
  onToggle: () => void;
};

export function ShowMoreButton({ hiddenCount, expanded, onToggle }: ShowMoreButtonProps) {
  if (hiddenCount <= 0 && !expanded) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full text-sm text-[var(--color-gold-light)]"
      onClick={onToggle}
    >
      {expanded ? 'Ver menos' : `Ver mais (${hiddenCount})`}
    </Button>
  );
}
