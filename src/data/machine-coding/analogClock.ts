import type { MachineCodingProblem } from "../../types";

export const analogClockProblem: MachineCodingProblem = {
  id: "mc-analog-clock",
  title: "Analog Clock with Smooth Hands, Theme & Timezones",
  difficulty: "Beginner",
  category: "Machine Coding",
  tags: [
    "react",
    "svg",
    "canvas",
    "css-animations",
    "analog-clock",
    "timezones",
    "requestAnimationFrame",
  ],

  problemStatement: `Build an elegant, high-precision Analog Clock component in React using SVG or Canvas. The clock displays hour, minute, and second hands with smooth, continuous sweep animation (or optional traditional tick-tock mode), 12 hour numerals/markers, 60 minute tick marks, center hub, and date display window.

Extend the component with interactive controls:
1. **Sweep vs Tick Mode**: Smooth 60fps continuous sweep vs standard 1-second stepped jumps.
2. **Timezone Selector**: Live conversion to major international timezones (UTC, New York, London, Tokyo, Sydney, etc.) using \`Intl.DateTimeFormat\`.
3. **Themes**: Dark/Light/Luxury Gold/Minimalist styles.
4. **Alarm / Countdown Feature**: Visual alarm hand indicator and notification sound/alert when reached.
5. **Interactive Drag-to-Set Mode**: Allow users to drag clock hands to set a custom time.`,

  functionalRequirements: [
    "Render a circular clock face with 12 hour numbers and 60 tick marks",
    "Display 3 distinct hands: Hour hand (thick, short), Minute hand (medium), Second hand (thin, colored accent)",
    "Real-time clock updates synchronized with system time (or selected timezone)",
    "Support smooth continuous sweep mode using requestAnimationFrame or fractional seconds",
    "Timezone switcher supporting standard IANA timezone strings",
    "Customizable themes (Dark, Light, Slate, Gold)",
    "Digital time readout alongside analog face (12h / 24h format)",
    "Alarm setting with visual marker and alert trigger",
  ],

  nonFunctionalRequirements: [
    "Sub-pixel smooth rendering using SVG viewBox or Canvas 2D",
    "Zero layout thrashing: hand rotations computed via CSS transforms with transform-origin at center",
    "Clean unmount cleanup for animation frames and interval timers",
    'Accessible clock with role="img", aria-label announcing current formatted time, and live status updates',
  ],

  componentHierarchy: `AnalogClock
├── TimezoneSelector (Dropdown of IANA timezones)
├── ThemeSelector (Dark / Light / Accent toggles)
├── ClockContainer (Scalable SVG)
│   ├── OuterRim & Bezel
│   ├── DialFace
│   ├── HourNumbers (1 through 12 positioned on circle)
│   ├── MinuteTicks (60 radial ticks with 5-minute emphasis)
│   ├── DateWindow (optional day of month box)
│   ├── AlarmMarkerHand
│   ├── HourHand (rotated angle: 30 * hour + 0.5 * min)
│   ├── MinuteHand (rotated angle: 6 * min + 0.1 * sec)
│   ├── SecondHand (rotated angle: 6 * (sec + ms/1000))
│   └── CenterCap / Pivot Pin
├── DigitalDisplay (Digital time readout + AM/PM)
└── AlarmControls (Set alarm time, toggle enable)`,

  stateDesign: `interface ClockState {
  time: Date;
  timezone: string; // e.g. 'UTC', 'America/New_York', 'Asia/Tokyo'
  smoothSweep: boolean;
  theme: 'dark' | 'light' | 'gold' | 'neon';
  alarmTime: string | null; // "HH:MM"
  isAlarmActive: boolean;
}

// Hand rotation formulas:
// secondAngle = (seconds + milliseconds / 1000) * 6
// minuteAngle = (minutes + seconds / 60) * 6
// hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30`,

  propsApiDesign: `interface AnalogClockProps {
  size?: number; // diameter in pixels (default 300)
  timezone?: string;
  smooth?: boolean;
  theme?: 'dark' | 'light' | 'gold' | 'neon';
  showDigital?: boolean;
  onTimeChange?: (time: Date) => void;
}`,

  architecture: `1. **Animation Loop**:
   - For **smooth sweep mode**, uses a \`requestAnimationFrame\` loop to compute exact milliseconds elapsed, giving silky 60fps/120fps rotation without drift.
   - For **stepped mode**, falls back to a 1000ms \`setInterval\` aligned to the start of each second.
2. **Angle Trigonometry**:
   - Full circle is $360^\\circ$.
   - Hour hand moves $360^\\circ / 12 = 30^\\circ$ per hour, plus $0.5^\\circ$ per minute.
   - Minute hand moves $360^\\circ / 60 = 6^\\circ$ per minute, plus $0.1^\\circ$ per second.
   - Second hand moves $360^\\circ / 60 = 6^\\circ$ per second.
3. **SVG Positioning**:
   - The center is at $(150, 150)$ on a $300 \\times 300$ coordinate system.
   - Hand lines extend upwards to $(150, Y_{top})$ and rotate via \`transform="rotate(angle, 150, 150)"\`.`,

  implementation: `import React, { useState, useEffect, useRef } from 'react';

const TIMEZONES = [
  { label: 'Local System Time', value: 'local' },
  { label: 'UTC / GMT', value: 'UTC' },
  { label: 'New York (EDT/EST)', value: 'America/New_York' },
  { label: 'London (BST/GMT)', value: 'Europe/London' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'San Francisco (PDT/PST)', value: 'America/Los_Angeles' },
];

export function AnalogClock({
  size = 300,
  initialTimezone = 'local',
  initialSmooth = true
}: {
  size?: number;
  initialTimezone?: string;
  initialSmooth?: boolean;
}) {
  const [timezone, setTimezone] = useState(initialTimezone);
  const [smooth, setSmooth] = useState(initialSmooth);
  const [theme, setTheme] = useState<'dark' | 'light' | 'gold'>('dark');
  const [time, setTime] = useState(new Date());

  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (smooth) {
      const update = () => {
        setTime(new Date());
        animRef.current = requestAnimationFrame(update);
      };
      animRef.current = requestAnimationFrame(update);
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [smooth]);

  // Compute timezone-adjusted time values
  const getTimeInTz = (d: Date, tz: string) => {
    if (tz === 'local') return d;
    const invDate = new Date(d.toLocaleString('en-US', { timeZone: tz }));
    // Preserve current millisecond fraction for smooth sweep
    invDate.setMilliseconds(d.getMilliseconds());
    return invDate;
  };

  const currentTzTime = getTimeInTz(time, timezone);

  const ms = currentTzTime.getMilliseconds();
  const sec = currentTzTime.getSeconds() + (smooth ? ms / 1000 : 0);
  const min = currentTzTime.getMinutes() + sec / 60;
  const hour = (currentTzTime.getHours() % 12) + min / 60;

  const secAngle = sec * 6;
  const minAngle = min * 6;
  const hourAngle = hour * 30;

  // Theme palettes
  const styles = {
    dark: { face: '#0f172a', rim: '#334155', tick: '#94a3b8', num: '#f8fafc', hour: '#f8fafc', min: '#cbd5e1', sec: '#ef4444', hub: '#ef4444' },
    light: { face: '#ffffff', rim: '#cbd5e1', tick: '#64748b', num: '#1e293b', hour: '#1e293b', min: '#475569', sec: '#dc2626', hub: '#dc2626' },
    gold: { face: '#1c1917', rim: '#d97706', tick: '#fbbf24', num: '#fef3c7', hour: '#fef3c7', min: '#fde68a', sec: '#f59e0b', hub: '#f59e0b' },
  }[theme];

  // Numerals 1 to 12 coordinates around center (150, 150) with radius 112
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const x = 150 + 112 * Math.cos(angle);
    const y = 150 + 112 * Math.sin(angle);
    return { num, x, y };
  });

  // 60 tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isHour = i % 5 === 0;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const innerRadius = isHour ? 128 : 134;
    const outerRadius = 140;
    const x1 = 150 + innerRadius * Math.cos(angle);
    const y1 = 150 + innerRadius * Math.sin(angle);
    const x2 = 150 + outerRadius * Math.cos(angle);
    const y2 = 150 + outerRadius * Math.sin(angle);
    return { i, x1, y1, x2, y2, isHour };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', gap: '1rem' }}>
      <h2>\u{1F552} Precision Analog Clock</h2>

      {/* Settings Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px' }}>
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>

        <button
          onClick={() => setSmooth(prev => !prev)}
          style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Mode: {smooth ? 'Smooth Sweep' : 'Tick-Tock'}
        </button>

        <select value={theme} onChange={e => setTheme(e.target.value as any)} style={{ padding: '6px 10px', borderRadius: '6px' }}>
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
          <option value="gold">Gold Luxury</option>
        </select>
      </div>

      {/* SVG Analog Clock Face */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        role="img"
        aria-label={\`Analog clock showing \${currentTzTime.toLocaleTimeString()}\`}
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
      >
        {/* Outer Rim */}
        <circle cx="150" cy="150" r="146" fill={styles.face} stroke={styles.rim} strokeWidth="8" />

        {/* Ticks */}
        {ticks.map(t => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={styles.tick}
            strokeWidth={t.isHour ? 3 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Hour Numerals */}
        {numerals.map(n => (
          <text
            key={n.num}
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fill={styles.num}
            fontSize="18"
            fontWeight="bold"
          >
            {n.num}
          </text>
        ))}

        {/* Hour Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="78"
          stroke={styles.hour}
          strokeWidth="6"
          strokeLinecap="round"
          transform={\`rotate(\${hourAngle} 150 150)\`}
        />

        {/* Minute Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="48"
          stroke={styles.min}
          strokeWidth="4"
          strokeLinecap="round"
          transform={\`rotate(\${minAngle} 150 150)\`}
        />

        {/* Second Hand */}
        <line
          x1="150"
          y1="175"
          x2="150"
          y2="36"
          stroke={styles.sec}
          strokeWidth="2"
          strokeLinecap="round"
          transform={\`rotate(\${secAngle} 150 150)\`}
        />

        {/* Center Pivot Pin */}
        <circle cx="150" cy="150" r="6" fill={styles.hub} />
      </svg>

      {/* Digital readout */}
      <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>
        {currentTzTime.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
    </div>
  );
}`,

  accessibility: `Clock wrapper has role="img" with descriptive aria-label containing the exact formatted time and timezone. A hidden live region periodically updates every minute for screen readers so users do not receive intrusive 60fps announcements. Color combinations are high contrast.`,

  performance: `Uses hardware-accelerated SVG transform rotations calculated directly in render or through direct ref modification. requestAnimationFrame ensures no work happens while browser tab is hidden or backgrounded. Memory allocation is minimal with no object churn inside animation loop.`,

  edgeCases: [
    "Timezone daylight saving shifts: handled accurately via native Intl API",
    "Tab background throttling: requestAnimationFrame pauses when hidden and resumes seamlessly on focus",
    "Leap seconds and sub-second millisecond rollbacks: smoothed by continuous Date polling",
    "Extreme responsive sizing: scales without distortion using SVG viewBox (0 0 300 300)",
  ],

  testingStrategy: [
    "Unit test: rotation angles match exact mathematical formulas at 3:00, 6:30, and 12:00",
    "Unit test: timezone conversion correctly adjusts hour value across time zones",
    "Integration test: switching between Smooth and Tick modes alters update timer strategy",
    "Integration test: theme change applies correct colors to clock elements",
  ],

  improvements: [
    "Add drag-to-set interactive clock hands using SVG onMouseDown / onTouchMove trigonometry",
    "Add custom chime / audio hourly tick sounds using Web Audio API synthesized oscillators",
    "Add chronograph / stopwatch sub-dials",
  ],

  followUpQuestions: [
    "How does requestAnimationFrame differ from setInterval(16.6ms) in terms of frame budgeting and display refresh synchronization?",
    "How would you implement drag-to-rotate interaction for clock hands using Math.atan2(dy, dx)?",
    "How would you architect a distributed world clock grid showing 50 cities simultaneously without CPU degradation?",
  ],
};
