interface PeriodSelectorProps {
  period: string[];
  setPeriod: (newPeriod: string[]) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  setPeriod,
}) => {
  return (
    <div className="period-selector">
      <select
        defaultValue={period[0]}
        onChange={(e) => {
          setPeriod([e.target.value, period[1], period[2]]);
        }}
      >
        <option value="past">Past</option>
        <option value="this">This</option>
        <option value="next">Next</option>
      </select>
      {period[0] !== "this" && (
        <input
          type="number"
          defaultValue={period[1]}
          min={1}
          max={99}
          onChange={(e) => {
            setPeriod([period[0], e.target.value, period[2]]);
          }}
        />
      )}
      <select
        defaultValue={period[2]}
        onChange={(e) => {
          setPeriod([period[0], period[1], e.target.value]);
        }}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>
  );
};

export default PeriodSelector;
