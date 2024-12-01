// react imports
import { useState, useEffect } from "react";

// helper functions
import { getAllCurrencies } from "../api/helpers";

// interfaces
import { CurrencyRates } from "../api/dataModels";

interface Props {
  rates: CurrencyRates;
}

const CurrencyWidget: React.FC<Props> = ({ rates }) => {
  const currencies = getAllCurrencies();

  const [amountFrom, setAmountFrom] = useState<number>(1);
  const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
  const [amountTo, setAmountTo] = useState<number>(rates["KZT"]);
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
    <div className="currency-widget component">
      <div className="header">
        <h2>Currency Converter</h2>
      </div>
      <div className="currency-input-container">
        <div className="currency-input">
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
          <input
            type="number"
            min={0}
            value={+amountFrom.toFixed(2)}
            onChange={(e) => {
              setAmountFrom(parseFloat(e.target.value));
              setIsFromInput(true);
            }}
          />
        </div>
        <div className="currency-input">
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
          <input
            type="number"
            min={0}
            value={+amountTo.toFixed(2)}
            onChange={(e) => {
              setAmountTo(parseFloat(e.target.value));
              setIsFromInput(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyWidget;
