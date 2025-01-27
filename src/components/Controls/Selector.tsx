// React imports
import { useEffect, useRef, useState } from "react";

// Helper functions
import { useClickHandler } from "../../utils/hooks";

// Types
import { isBlankString } from "../../utils/formatting";

interface Option {
  id: string;
  name: string;
}

interface SelectorProps {
  options: Option[];
  initValue?: Option;
  selectOption: (optionId: string) => void;
  createOption?: (optionName: string) => void;
}

const Selector: React.FC<SelectorProps> = ({
  options,
  initValue,
  selectOption,
  createOption,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [filterStr, setFilterStr] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const clickRef = useClickHandler<HTMLDivElement>({
    onInsideClick: () => {
      setOpen(true);
    },
    onOutsideClick: () => {
      setOpen(false);
      setFilterStr("");
    },
  });

  let exactMatch: boolean = false;
  const filteredOptions = options.filter((option) => {
    if (option.name === filterStr) exactMatch = true;
    return option.name.toLowerCase().includes(filterStr.toLowerCase());
  });

  return (
    <div ref={clickRef} className="selector-container">
      {initValue && (
        <div className="flex-center frame color-blue">{initValue.name}</div>
      )}
      {open && (
        <div className="selector" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setFilterStr(e.currentTarget.value)}
          />
          <div className="selector-options">
            {filteredOptions.map((option, id) => {
              return (
                <button
                  onClick={() => {
                    setOpen(false);
                    selectOption(option.id);
                  }}
                  className="selector-option"
                  key={id}
                >
                  <div className="flex-center frame color-blue">
                    {option.name}
                  </div>
                </button>
              );
            })}
            {createOption && !exactMatch && !isBlankString(filterStr) && (
              <button
                className="selector-option"
                type="submit"
                onClick={() => {
                  setOpen(false);
                  createOption(filterStr);
                }}
              >
                <div className="flex-center selector-create">
                  <span>Create: </span>
                  <div
                    key={"createOption"}
                    className="flex-center frame color-blue"
                  >
                    {filterStr}
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selector;
