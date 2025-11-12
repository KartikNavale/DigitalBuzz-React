import React, { useState, useEffect, useRef } from "react";
import Card from "../components/Card";

export default function Dropdown() {
  const [opts, setOpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [hi, setHi] = useState(0);

  const inRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const items = [
        { value: "office", label: "Office Space" },
        { value: "plot", label: "Plot" },
        { value: "shop", label: "Shop" },
        { value: "warehouse", label: "Warehouse" },
        { value: "studio", label: "Studio" },
        { value: "villa", label: "Villa" },
        { value: "apartment", label: "Apartment" },
        { value: "farm", label: "Farmhouse" },
        { value: "land", label: "Land" },
      ];
      setOpts(items);
      setList(items);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!q) return setList(opts), setHi(0);
    const fq = q.toLowerCase();
    setList(opts.filter((o) => o.label.toLowerCase().includes(fq)));
    setHi(0);
  }, [q, opts]);

  useEffect(() => {
    const docClick = (e) =>
      boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", docClick);
    return () => document.removeEventListener("mousedown", docClick);
  }, []);

  const isSel = (v) => sel.some((s) => s.value === v);
  const toggle = (o) => {
    setSel((p) =>
      isSel(o.value) ? p.filter((x) => x.value !== o.value) : [...p, o]
    );
    setQ("");
    setOpen(true);
    inRef.current?.focus();
  };
  const remove = (v) => setSel((p) => p.filter((x) => x.value !== v));
  const clearAll = () => (setSel([]), setQ(""), inRef.current?.focus());

  const onKey = (e) => {
    if (e.key === "ArrowDown")
      return (
        e.preventDefault(),
        setOpen(true),
        setHi((i) => Math.min(i + 1, Math.max(list.length - 1, 0)))
      );
    if (e.key === "ArrowUp")
      return e.preventDefault(), setHi((i) => Math.max(i - 1, 0));
    if (e.key === "Enter")
      return e.preventDefault(), list[hi] && toggle(list[hi]);
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "Backspace" && !q) return setSel((p) => p.slice(0, -1));
  };

  return (
    <Card title="2. Dropdown / Select Widget">
      <div className="w-full max-w-xl mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Property Sub-Type <span className="text-red-500">*</span>
        </label>

        <div ref={boxRef} className="relative">
          <div
            role="combobox"
            aria-expanded={open}
            aria-owns="multi-select-list"
            onClick={() => (setOpen(true), inRef.current?.focus())}
            className="min-h-[44px] flex items-center flex-wrap gap-2 px-3 py-2 rounded-md border-2 border-green-200 bg-white cursor-text"
          >
            {!sel.length && !q && (
              <div className="text-gray-400 text-sm select-none">
                Select property types...
              </div>
            )}

            {sel.map((s) => (
              <div
                key={s.value}
                className="flex items-center gap-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
              >
                <span className="truncate max-w-[140px]">{s.label}</span>
                <button
                  onClick={(e) => (e.stopPropagation(), remove(s.value))}
                  aria-label={`Remove ${s.label}`}
                  className="text-gray-500 hover:text-gray-700 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}

            <input
              ref={inRef}
              value={q}
              onChange={(e) => (setQ(e.target.value), setOpen(true))}
              onFocus={() => setOpen(true)}
              onKeyDown={onKey}
              className="flex-1 min-w-[80px] outline-none text-sm px-1 py-1 bg-transparent"
              aria-controls="multi-select-list"
              placeholder=""
            />

            {sel.length > 0 && (
              <button
                onClick={(e) => (e.stopPropagation(), clearAll())}
                className="ml-2 text-xs text-red-500 hover:underline"
              >
                CLEAR ALL
              </button>
            )}

            <div className="ml-2">
              <button
                onClick={(e) => (
                  e.stopPropagation(),
                  setOpen((s) => !s),
                  inRef.current?.focus()
                )}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-50"
                aria-label="toggle options"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#374151"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <div
              id="multi-select-list"
              role="listbox"
              aria-multiselectable="true"
              className="absolute z-40 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto"
            >
              {loading ? (
                <div className="p-3 text-sm text-gray-500">
                  Loading options...
                </div>
              ) : list.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No matches</div>
              ) : (
                list.map((o, idx) => {
                  const checked = isSel(o.value);
                  const highlighted = idx === hi;
                  return (
                    <div
                      key={o.value}
                      role="option"
                      aria-selected={checked}
                      onMouseDown={(e) => (e.preventDefault(), toggle(o))}
                      onMouseEnter={() => setHi(idx)}
                      className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm ${
                        highlighted ? "bg-indigo-50" : "hover:bg-gray-50"
                      } ${checked ? "font-semibold" : "font-normal"}`}
                    >
                      <div className="truncate">{o.label}</div>
                      {checked && (
                        <div className="text-xs text-indigo-600">Selected</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-500">
          {sel.length > 0 ? (
            <>
              <div className="text-xs text-gray-400 mb-1">Selected</div>
              <div className="flex flex-wrap gap-2">
                {sel.map((s) => (
                  <div
                    key={s.value}
                    className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800"
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400">No selection</div>
          )}
        </div>
      </div>
    </Card>
  );
}
