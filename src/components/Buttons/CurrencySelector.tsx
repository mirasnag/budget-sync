import { getAllCurrencies } from "../../api/helpers";

interface CurrencySelectorProps {
  baseCurrency: string | null;
  setBaseCurrency: (newBaseCurrency: string | null) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  baseCurrency,
  setBaseCurrency,
}) => {
  const currencies = getAllCurrencies();

  return (
    <select
      defaultValue={baseCurrency ?? ""}
      onChange={(e) =>
        setBaseCurrency(e.target.value === "" ? null : e.target.value)
      }
    >
      <option key={""} value="">
        {baseCurrency ? "Revert" : "Convert"}
      </option>
      {currencies.map((currency) => {
        return (
          <option key={currency} value={currency}>
            {currency}
          </option>
        );
      })}
    </select>
  );
};

export default CurrencySelector;
