import { useState } from "react";
import DatePicker from "./DatePicker";
import { formatDate } from "../../utils/formatting";

export interface AbsolutePeriod {
  type: "absolute";
  start: string;
  end: string;
}

export interface RelativePeriod {
  type: "relative";
  option: "Past" | "This" | "Next";
  value: number | null; // always null for "This"
  unit: "Year" | "Month" | "Week" | "Day";
}

export type Period = AbsolutePeriod | RelativePeriod;

interface PeriodSelectorProps {
  period: Period;
  setPeriod: (newPeriod: Period) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  setPeriod,
}) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const formattedDate =
    period.type === "absolute"
      ? `${formatDate(new Date(period.start))} - ${formatDate(
          new Date(period.end)
        )}`
      : `${period.option} ${
          Number(period.value ?? 0) > 1
            ? period.value + " " + period.unit + "s"
            : period.unit
        }`;

  const handlePeriodTypeChange = (newType: string) => {
    const isRelative = newType === "relative";
    if (isRelative) {
      setPeriod({
        type: "relative",
        option: "This",
        value: null,
        unit: "Month",
      });
    } else {
      setPeriod({
        type: "absolute",
        start: "2024-01-01",
        end: "2024-12-31",
      });
    }
  };

  const handleAbsoluteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPeriod({
      ...period,
      [name]: value,
    } as AbsolutePeriod);
  };

  const handleRelativeChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (period.type === "relative") {
      setPeriod({
        ...period,
        [name]: name === "value" ? (value ? Number(value) : null) : value,
      } as RelativePeriod);
    }
  };

  return (
    <div className="period-selector btn">
      <div className="period-text" onClick={() => setShowEditor(!showEditor)}>
        {formattedDate}
      </div>
      {showEditor && (
        <div className="editor">
          <div className="date-type-selector">
            <div
              className={period.type === "absolute" ? "active" : ""}
              onClick={() => handlePeriodTypeChange("absolute")}
            >
              <span>Absolute</span>
            </div>
            <div
              className={period.type === "relative" ? "active" : ""}
              onClick={() => handlePeriodTypeChange("relative")}
            >
              <span>Relative</span>
            </div>
          </div>

          {period.type === "absolute" && (
            <div className="editor-absolute">
              <DatePicker
                label={"start"}
                value={period.start}
                setValue={handleAbsoluteChange}
              />
              <span> - </span>
              <DatePicker
                label={"end"}
                value={period.end}
                setValue={handleAbsoluteChange}
              />
            </div>
          )}

          {period.type === "relative" && (
            <div className="editor-relative">
              <div>
                <select
                  name="option"
                  value={period.option}
                  onChange={handleRelativeChange}
                >
                  <option value="Past">Past</option>
                  <option value="This">This</option>
                  <option value="Next">Next</option>
                </select>
              </div>
              {period.option !== "This" && (
                <div>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    min={1}
                    value={period.value ?? ""}
                    onChange={handleRelativeChange}
                  />
                </div>
              )}
              <div>
                <select
                  name="unit"
                  value={period.unit}
                  onChange={handleRelativeChange}
                >
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                  <option value="Week">Week</option>
                  <option value="Day">Day</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
