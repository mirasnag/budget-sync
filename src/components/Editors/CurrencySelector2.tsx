import { useEffect, useRef, useState } from "react";
import { getAllCurrencies } from "../../utils/currency.util";
import { useClickHandler } from "../../utils/hooks";

interface CurrencySelectorProps {
  initialValue: string | null;
  setValue: (newValue: string) => void;
}

const CurrencySelector2: React.FC<CurrencySelectorProps> = ({
  initialValue,
  setValue,
}) => {
  const currencies = getAllCurrencies();
  const name = initialValue;

  const [open, setOpen] = useState<boolean>(false);
  const [filterStr, setFilterStr] = useState<string>("");

  const clickRef = useClickHandler<HTMLDivElement>({
    onInsideClick: () => {
      setOpen(true);
    },
    onOutsideClick: () => {
      setOpen(false);
      setFilterStr("");
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = currencies.filter((currency) => {
    return currency.toLowerCase().includes(filterStr.toLowerCase());
  });

  return (
    <div ref={clickRef} className="currency-selector-container ">
      {name && <div className="flex-center frame color-blue">{name}</div>}
      {!name && <div>{name}</div>}
      {open && (
        <div className="currency-selector" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setFilterStr(e.currentTarget.value)}
          />
          <div className="options-container">
            {filteredOptions.map((option) => {
              return (
                <button
                  onClick={() => {
                    setOpen(false);
                    setValue(option);
                  }}
                  className="currency-option"
                  key={option}
                >
                  <div key={option} className="flex-center frame color-blue">
                    {option}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector2;
