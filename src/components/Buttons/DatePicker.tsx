interface DatePickerProps {
  label: string;
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, setValue }) => {
  return (
    <div className="date-picker">
      <input
        type="date"
        name={label}
        value={value}
        onChange={(e) => setValue(e)}
      />
    </div>
  );
};

export default DatePicker;
