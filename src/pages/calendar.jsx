import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Card from "../components/Card";

const Calendar = ({ initialDate }) => {
  const now = new Date();
  const [showPicker, setShowPicker] = useState(true);
  const [viewDate, setViewDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : null
  );
  const [appliedDate, setAppliedDate] = useState(null);

  // time
  const initHour = selectedDate
    ? selectedDate.getHours() % 12 || 12
    : now.getHours() % 12 || 12;
  const initMinute = selectedDate
    ? selectedDate.getMinutes()
    : now.getMinutes();
  const initAmPm = selectedDate
    ? selectedDate.getHours() >= 12
      ? "PM"
      : "AM"
    : now.getHours() >= 12
    ? "PM"
    : "AM";

  const [hour, setHour] = useState(initHour);
  const [minute, setMinute] = useState(initMinute);
  const [ampm, setAmPm] = useState(initAmPm);

  //start of month grid
  const monthMatrix = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay(); // 0 Sun ... 6 Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let cur = 1 - startDay;
    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let d = 0; d < 7; d++, cur++) {
        const date = new Date(year, month, cur);
        weekRow.push(date);
      }
      matrix.push(weekRow);
    }
    return matrix;
  }, [viewDate]);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isPastDate = (d) => {
    const compare = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return compare < today;
  };

  const prevMonth = () =>
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  // pick day
  const pickDay = (d) => {
    if (isPastDate(d)) return;
    setSelectedDate(
      new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        convertTo24Hour(hour, ampm),
        minute
      )
    );
  };

  // time helpers
  function convertTo24Hour(h, ap) {
    let hh = Number(h);
    if (ap === "AM") {
      if (hh === 12) hh = 0;
    } else {
      if (hh !== 12) hh = hh + 12;
    }
    return hh;
  }

  const incHour = () => setHour((h) => (h === 12 ? 1 : h + 1));
  const decHour = () => setHour((h) => (h === 1 ? 12 : h - 1));
  const incMinute = () => setMinute((m) => (m + 1 >= 60 ? 0 : m + 1));
  const decMinute = () => setMinute((m) => (m - 1 < 0 ? 59 : m - 1));
  const toggleAmPm = () => setAmPm((a) => (a === "AM" ? "PM" : "AM"));

  const handleSet = () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    const applied = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      convertTo24Hour(hour, ampm),
      minute
    );

    setAppliedDate(applied);

    alert(`Date & Time Set Successfully!\n\n${applied.toLocaleString()}`);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setAppliedDate(null);
    setShowPicker(false);
  };

  React.useEffect(() => {
    if (selectedDate) {
      const h24 = selectedDate.getHours();
      const hh = h24 % 12 === 0 ? 12 : h24 % 12;
      setHour(hh);
      setMinute(selectedDate.getMinutes());
      setAmPm(h24 >= 12 ? "PM" : "AM");
    }
  }, [selectedDate]);

  const formatMonthTitle = (d) => {
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <Card title="1. DateTime Widget Customization">
      <div className="w-[360px] mx-auto">
        <div
          className="bg-[#14121a] text-white rounded-2xl shadow-2xl overflow-auto select-none custom-calender"
          style={{
            boxShadow: "0 12px 30px rgba(5,6,20,0.6)",
            width: "375px",
            height: "450px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/20">
            <button
              onClick={prevMonth}
              className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center"
              aria-label="prev month"
            >
              ‹
            </button>

            <div className="text-lg font-semibold">
              {formatMonthTitle(viewDate)}{" "}
              <span className="text-white/60">▾</span>
            </div>

            <button
              onClick={nextMonth}
              className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center"
              aria-label="next month"
            >
              ›
            </button>
          </div>

          {/* Weekday*/}
          <div className="grid grid-cols-7 gap-1 px-4 pt-4 pb-2 text-xs text-white/70">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
              <div key={wd} className="text-center">
                {wd}
              </div>
            ))}
          </div>

          {/* Dates*/}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-7 gap-4 text-center">
              {monthMatrix.flat().map((d, i) => {
                const isOtherMonth = d.getMonth() !== viewDate.getMonth();
                const disabled = isPastDate(d);
                const isSelected =
                  selectedDate &&
                  d.getFullYear() === selectedDate.getFullYear() &&
                  d.getMonth() === selectedDate.getMonth() &&
                  d.getDate() === selectedDate.getDate();

                return (
                  <button
                    key={i}
                    onClick={() => pickDay(d)}
                    disabled={disabled}
                    className={`
                      relative mx-auto w-9 h-9 rounded-full flex items-center justify-center 
                      ${isOtherMonth ? "text-white/30" : "text-white/85"}
                      ${
                        disabled
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:text-white"
                      }
                      ${isSelected ? "bg-[#3fc1a2] text-white" : ""}
                    `}
                    aria-pressed={isSelected}
                    title={d.toDateString()}
                  >
                    <span className="text-sm font-medium">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-black/20" />

          {/* Time selector*/}
          <div className="px-6 py-6">
            <div className="flex items-center justify-center space-x-6">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <button onClick={incHour} className="text-white/70 mb-2">
                  ▲
                </button>
                <div className="bg-white text-black w-12 h-12 rounded-sm flex items-center justify-center text-xl font-medium">
                  {String(hour).padStart(2, " ")}
                </div>
                <button onClick={decHour} className="text-white/70 mt-2">
                  ▼
                </button>
              </div>

              <div className="text-2xl font-bold">:</div>

              {/* Minute */}
              <div className="flex flex-col items-center">
                <button onClick={incMinute} className="text-white/70 mb-2">
                  ▲
                </button>
                <div className="bg-white text-black w-16 h-12 rounded-sm flex items-center justify-center text-xl font-medium">
                  {String(minute).padStart(2, "0")}
                </div>
                <button onClick={decMinute} className="text-white/70 mt-2">
                  ▼
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col items-center">
                <div
                  onClick={toggleAmPm}
                  className="border border-white/40 px-4 py-2 rounded-sm cursor-pointer"
                  role="button"
                >
                  <div className="text-sm font-semibold">{ampm}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/20">
            <button
              onClick={handleCancel}
              className="text-lg text-white/90 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSet}
              className="text-lg text-white/90 hover:text-white"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

Calendar.propTypes = {
  initialDate: PropTypes.string,
};

export default Calendar;
