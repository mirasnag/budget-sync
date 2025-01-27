import { getAllCurrencies } from "../../utils/currency.util";
import Selector from "../Controls/Selector";

interface CurrencySelectorProps {
  initialValue: string | null;
  setValue: (newValue: string) => void;
}

const CurrencySelector2: React.FC<CurrencySelectorProps> = ({
  initialValue,
  setValue,
}) => {
  const currencies = getAllCurrencies();

  return (
    <Selector
      initValue={
        initialValue ? { id: initialValue, name: initialValue } : undefined
      }
      selectOption={setValue}
      options={currencies.map((currency) => {
        return {
          id: currency,
          name: currency,
        };
      })}
    />
  );
};

export default CurrencySelector2;
