import {
  type ChangeEvent,
  type InputHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrencyInput, parseCurrency } from '@/utils/format';

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'inputMode'
> & {
  value?: number | null;
  onChange?: (value: number) => void;
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onChange, onBlur, ...props }, ref) {
    const [display, setDisplay] = useState(() => formatCurrencyInput(value ?? null));

    useEffect(() => {
      setDisplay(formatCurrencyInput(value ?? null));
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, '');
      if (!digits) {
        setDisplay('');
        onChange?.(Number.NaN);
        return;
      }

      const amount = Number(digits) / 100;
      setDisplay(formatCurrencyInput(amount));
      onChange?.(amount);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={props.placeholder ?? '0,00'}
        value={display}
        onChange={handleChange}
        onBlur={(event) => {
          const parsed = parseCurrency(display);
          if (Number.isFinite(parsed)) {
            setDisplay(formatCurrencyInput(parsed));
            onChange?.(parsed);
          }
          onBlur?.(event);
        }}
      />
    );
  },
);
