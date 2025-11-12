import React, { useState } from "react";
import Card from "../components/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const makeSample = () => {
  const today = new Date();
  const arr = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(80 + Math.random() * 120),
      extra: Math.round(10 + Math.random() * 30),
    });
  }
  return arr;
};

const COLORS = ["#4f46e5", "#06b6d4"];

const SimpleTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white text-sm text-gray-800 p-2 rounded shadow">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded"
            style={{ background: p.stroke || p.color }}
          />
          <span>
            {p.name}: <strong>{p.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Chart() {
  const data = makeSample();

  // UI state
  const [chartType, setChartType] = useState("line");
  const [from, setFrom] = useState(data[0].date);
  const [to, setTo] = useState(data[data.length - 1].date);

  // filter data by date
  const filtered = data.filter((d) => d.date >= from && d.date <= to);

  // pie
  const pieData = [
    { name: "Value", value: filtered.reduce((s, r) => s + r.value, 0) },
    { name: "Extra", value: filtered.reduce((s, r) => s + r.extra, 0) },
  ];

  return (
    <Card title="3. Chart Widget Customization">
      <div className="space-y-4">
        {/* controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Chart</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 rounded border text-sm bg-white"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-2 py-2 rounded border text-sm"
            />
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-2 py-2 rounded border text-sm"
            />
            <button
              onClick={() => {
                //last 7 days
                const t = new Date();
                const f = new Date();
                f.setDate(t.getDate() - 6);
                setFrom(f.toISOString().slice(0, 10));
                setTo(t.toISOString().slice(0, 10));
              }}
              className="ml-2 text-sm px-3 py-2 bg-indigo-600 text-white rounded"
            >
              Last 7 days
            </button>
          </div>
        </div>

        {/* chart */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-gray-500">
              No data for selected range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              {chartType === "line" && (
                <LineChart data={filtered}>
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                  <YAxis />
                  <Tooltip content={<SimpleTooltip />} />
                  <Line
                    name="Value"
                    dataKey="value"
                    stroke={COLORS[0]}
                    dot={false}
                  />
                  <Line
                    name="Extra"
                    dataKey="extra"
                    stroke={COLORS[1]}
                    dot={false}
                  />
                </LineChart>
              )}

              {chartType === "bar" && (
                <BarChart data={filtered}>
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                  <YAxis />
                  <Tooltip content={<SimpleTooltip />} />
                  <Bar dataKey="value" name="Value" fill={COLORS[0]} />
                  <Bar dataKey="extra" name="Extra" fill={COLORS[1]} />
                </BarChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Tooltip content={<SimpleTooltip />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing <strong>{filtered.length}</strong> points from{" "}
            <strong>{from}</strong> to <strong>{to}</strong>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded"
                style={{ background: COLORS[0] }}
              />
              <span>Value</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded"
                style={{ background: COLORS[1] }}
              />
              <span>Extra</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
