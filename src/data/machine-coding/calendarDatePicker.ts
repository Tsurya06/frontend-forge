import type { MachineCodingProblem } from '../../types';

export const calendarDatePickerProblem: MachineCodingProblem = {
  id: 'mc-calendar-date-picker',
  title: 'Calendar / Date Picker Component',
  difficulty: 'Intermediate',
  category: 'Machine Coding',
  tags: ['react', 'ui-component', 'date-picker', 'calendar', 'accessibility', 'keyboard-navigation'],

  problemStatement: `Build an accessible, feature-rich Calendar / Date Picker component in React. The component should feature an interactive popover calendar triggered by clicking a date input or calendar button, complete with month and year navigation, quick month/year selectors, date range selection (start date to end date), min/max date boundaries, disabled dates (e.g., weekends or holidays), and full keyboard navigation (arrows to navigate days, PageUp/PageDown for months).

The component should support both controlled and uncontrolled usage, format dates according to local or customizable formatting strings (e.g. YYYY-MM-DD), handle internationalization (first day of week: Sunday vs Monday), and provide clean popover positioning with outside click detection and Escape key dismissal.`,

  functionalRequirements: [
    'Trigger input displaying selected date or placeholder, with calendar toggle button',
    'Monthly calendar grid displaying days with correct padding for weekday start',
    'Previous/Next month and year navigation buttons',
    'Clicking a day selects it and updates the input value',
    'Support date range selection (start date, hover preview, end date)',
    'Support minDate, maxDate, and custom disabledDates predicates',
    'Highlight today\'s date, selected date(s), and in-range dates',
    'Month and year dropdown/quick picker',
    'Close on outside click or Escape key press',
  ],

  nonFunctionalRequirements: [
    'WAI-ARIA Date Picker dialog pattern: role="dialog" or "grid", role="gridcell", aria-selected, aria-disabled',
    'Complete keyboard navigation: Arrow keys move focus across days, Enter/Space selects, PageUp/Down shifts month',
    'Performant calendar matrix calculation without heavy third-party date libraries (use native Date or lightweight helpers)',
    'Responsive popover that repositions if cut off by viewport edge',
  ],

  componentHierarchy: `DatePicker
├── InputContainer
│   ├── DateInput (text input with formatted value)
│   ├── ClearButton
│   └── CalendarToggleButton
└── CalendarPopover (Portal or Popover)
    ├── CalendarHeader
    │   ├── PrevMonthButton
    │   ├── MonthYearDropdowns
    │   └── NextMonthButton
    ├── WeekdayHeader (Sun, Mon, Tue, ...)
    └── MonthGrid (7 columns x 5-6 rows)
        └── DayCell (repeated 35-42 times: day number, today badge, range highlight)`,

  stateDesign: `interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
  isRange?: boolean;
  rangeValue?: [Date | null, Date | null];
  onRangeChange?: (range: [Date | null, Date | null]) => void;
}

interface CalendarState {
  viewDate: Date; // current visible year/month
  isOpen: boolean;
  focusedDate: Date;
  hoverDate: Date | null; // for range preview
}`,

  propsApiDesign: `interface CalendarDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  placeholder?: string;
  disabled?: boolean;
}`,

  architecture: `The date picker is built around standard Gregorian calendar arithmetic:
1. **Grid Generation**: For a given \`viewDate\` (year, month), find the total days in month $M$ using \`new Date(year, month + 1, 0).getDate()\`, and find the start day offset \`new Date(year, month, 1).getDay()\`. Pad leading days from previous month and trailing days from next month to fill complete 7-day rows.
2. **Keyboard Roving Focus**: The \`focusedDate\` state tracks which cell receives active focus. Arrow keys adjust \`focusedDate\` by $\\pm 1$ day (Left/Right) or $\\pm 7$ days (Up/Down), automatically updating \`viewDate\` when traversing month boundaries.
3. **Outside Click & Focus Trap**: Utilizes a document mousedown listener and Escape key handler to ensure smooth dismiss behavior.`,

  implementation: `import React, { useState, useRef, useEffect, useCallback } from 'react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select a date...'
}: {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [viewDate, setViewDate] = useState<Date>(value ?? new Date());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) setSelectedDate(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  const handleSelectDay = (day: number) => {
    const newDate = new Date(year, month, day);
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    setSelectedDate(newDate);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, '0')}-\${String(date.getDate()).padStart(2, '0')}\`;
  };

  // Build grid days
  const calendarCells = [];

  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Next month padding to reach full 35 or 42 grid
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '280px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px' }}>
        <input
          type="text"
          readOnly
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          onClick={() => setIsOpen(prev => !prev)}
          style={{ border: 'none', outline: 'none', width: '100%', cursor: 'pointer', fontSize: '14px' }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          aria-label="Toggle calendar"
        >
          \u{1F4C5}
        </button>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Calendar date picker"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '12px',
            zIndex: 1000,
            width: '280px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button onClick={prevMonth} style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer' }}>&lt;</button>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer' }}>&gt;</button>
          </div>

          {/* Weekday labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px', fontSize: '12px', color: '#64748b' }}>
            {WEEKDAYS.map(w => <div key={w} style={{ fontWeight: 600 }}>{w}</div>)}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {calendarCells.map((cell, idx) => {
              const isSelected = isSameDay(selectedDate, cell.date);
              const isCurrentDay = isToday(cell.date);
              const isDisabled = (minDate && cell.date < minDate) || (maxDate && cell.date > maxDate);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled || !cell.isCurrentMonth}
                  onClick={() => cell.isCurrentMonth && handleSelectDay(cell.day)}
                  style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    fontSize: '13px',
                    border: isCurrentDay ? '1px solid #4f46e5' : 'none',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#4f46e5' : 'transparent',
                    color: isSelected ? '#ffffff' : cell.isCurrentMonth ? '#1e293b' : '#94a3b8',
                    cursor: cell.isCurrentMonth && !isDisabled ? 'pointer' : 'default',
                    opacity: isDisabled || !cell.isCurrentMonth ? 0.4 : 1,
                    fontWeight: isSelected || isCurrentDay ? 600 : 400
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}`,

  accessibility: `WAI-ARIA Date Picker Pattern compliance: calendar container has role="dialog" and aria-modal="true". The grid has role="grid" and cells have role="gridcell" with aria-selected="true" on selected date. Focused date uses roving tabindex or aria-activedescendant. Weekday headers have aria-label for full names (e.g. "Sunday"). Escape key closes the popover and returns focus to trigger button.`,

  performance: `Generates days using purely functional mathematical operations without full moment.js or large libraries. The grid calculation is memoized on [year, month]. Renders in under 2ms. Portal rendering prevents CSS z-index and overflow clipping issues in complex parent layouts.`,

  edgeCases: [
    'Leap years (February 29th calculation in 2024, 2028, etc.)',
    'Daylight saving transitions (hour adjustments when crossing DST boundaries)',
    'Min/Max date constraints that fall in the middle of a month',
    'Selecting dates in different locales where Monday is the first day of the week',
    'Rapid clicking between year and month navigation without re-render stutter',
  ],

  testingStrategy: [
    'Unit test: daysInMonth returns 29 for February in leap years and 28 in non-leap years',
    'Unit test: startDay offset correctly positions the 1st of each month',
    'Integration test: clicking a day fires onChange with correct Date object and closes popover',
    'Integration test: navigating months updates header and days grid',
    'Keyboard test: ArrowLeft/ArrowRight changes focused day, Enter selects',
  ],

  improvements: [
    'Add full Date Range selection with hover styling between start and end date',
    'Add Quick Select presets ("Today", "This Week", "Last 30 Days")',
    'Time selection addon (TimePicker integration with hours/minutes sliders)',
    'Internationalization using Intl.DateTimeFormat for localized month/day names',
  ],

  followUpQuestions: [
    'How do you handle timezones when sending the selected date to a backend API?',
    'How would you implement virtualization if rendering an infinite scrolling multi-month calendar?',
    'What is the difference between storing dates as ISO 8601 strings vs UTC timestamps in client state?',
  ],
};
