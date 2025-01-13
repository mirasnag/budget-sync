import { useRef, useState } from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { formatDate, formatDateToInputValue } from "../../utils/formatting";

interface DatePickerProps {
  initialValue: Date;
  onDateChange: (newValue: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  initialValue,
  onDateChange,
}) => {
  const [value, setValue] = useState<Date>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  return (
    <div className="date-picker">
      <div>{formatDate(value)}</div>
      <input
        type="date"
        ref={inputRef}
        value={formatDateToInputValue(value)}
        onChange={(e) => {
          const newValue = new Date(e.currentTarget.value);
          setValue(newValue);
          onDateChange(newValue);
        }}
      />
      <div className="date-icon" onClick={handleIconClick}>
        <FaCalendarDays />
      </div>
    </div>
  );
};

export default DatePicker;
