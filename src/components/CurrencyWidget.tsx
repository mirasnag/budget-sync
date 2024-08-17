// react imports
import { useState, useEffect } from "react";

// helper functions
import { DataItem, getAllCurrencies } from "../api/helpers";

interface Props {
  rates: DataItem;
}

const CurrencyWidget: React.FC<Props> = ({ rates }) => {
  const currencies = getAllCurrencies();

  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
  const [amountTo, setAmountTo] = useState<number>(0);
  const [currencyTo, setCurrencyTo] = useState<string>("KZT");
  const [isFromInput, setIsFromInput] = useState<boolean>(true);

  const convertFromTo = () => {
    if (currencyFrom === "USD") {
      const rateTo = rates[currencyTo] || 1;
      setAmountTo(amountFrom * rateTo);
    } else if (currencyTo === "USD") {
      const rateFrom = rates[currencyFrom] || 1;
      setAmountTo(amountFrom / rateFrom);
    } else {
      const rateFrom = rates[currencyFrom] || 1;
      const rateTo = rates[currencyTo] || 1;
      setAmountTo((amountFrom / rateFrom) * rateTo);
    }
  };

  const convertToFrom = () => {
    if (currencyFrom === "USD") {
      const rateTo = rates[currencyTo] || 1;
      setAmountFrom(amountTo / rateTo);
    } else if (currencyTo === "USD") {
      const rateFrom = rates[currencyFrom] || 1;
      setAmountFrom(amountTo * rateFrom);
    } else {
      const rateFrom = rates[currencyFrom] || 1;
      const rateTo = rates[currencyTo] || 1;
      setAmountFrom((amountTo * rateFrom) / rateTo);
    }
  };

  useEffect(() => {
    if (isFromInput) {
      convertFromTo();
    } else {
      convertToFrom();
    }
  }, [amountFrom, currencyFrom, currencyTo, amountTo, isFromInput]);

  return (
    <div className="currency-widget">
      <h2>Currency Converter</h2>
      <div>
        <input
          type="number"
          min={0}
          value={+amountFrom.toFixed(2)}
          onChange={(e) => {
            setAmountFrom(parseFloat(e.target.value));
            setIsFromInput(true);
          }}
        />
        <select
          value={currencyFrom}
          onChange={(e) => setCurrencyFrom(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="number"
          min={0}
          value={+amountTo.toFixed(2)}
          onChange={(e) => {
            setAmountTo(parseFloat(e.target.value));
            setIsFromInput(false);
          }}
        />
        <select
          value={currencyTo}
          onChange={(e) => setCurrencyTo(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencyWidget;
