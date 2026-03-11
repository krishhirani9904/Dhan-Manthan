import { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';

const seededRandom = (s) => {
  const x = Math.sin(s * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function PriceChart({ seed = 0, volatility = 0.05, height = 160, basePrice = 100 }) {
  const { isDark } = useTheme();

  const chartId = useMemo(() =>
    `chart_${seed}_${Math.floor(seededRandom(seed + 999) * 99999)}`, [seed]);

  const points = useMemo(() => {
    const pts = [];
    let val = 50;
    for (let i = 0; i < 48; i++) {
      val += (Math.sin(seed / 30000 * 0.7 + i * 0.7) * volatility * 50) +
        (Math.cos(seed / 30000 * 0.3 + i * 1.3) * volatility * 30) +
        (seededRandom(seed + i * 137) - 0.5) * volatility * 20;
      val = Math.max(5, Math.min(95, val));
      pts.push(val);
    }
    return pts;
  }, [seed, volatility]);

  const svgWidth = 360;
  const svgHeight = height;
  const padLeft = 50;
  const padBottom = 24;
  const padTop = 10;
  const padRight = 10;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;

  const isUp = points[points.length - 1] >= points[0];
  const strokeColor = isUp ? '#22c55e' : '#ef4444';

  const getX = (i) => padLeft + (i / (points.length - 1)) * chartW;
  const getY = (v) => padTop + chartH - ((v - minVal) / range) * chartH;

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p).toFixed(1)}`
  ).join(' ');

  const areaD = pathD +
    ` L ${getX(points.length - 1).toFixed(1)} ${padTop + chartH}` +
    ` L ${padLeft} ${padTop + chartH} Z`;

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minVal + (range * i / 4);
    const price = Math.floor(basePrice * (1 + (val - 50) / 100 * volatility * 2));
    return { y: getY(val), label: `₹${price >= 1000 ? (price / 1000).toFixed(1) + 'K' : price}` };
  });

  // X-axis labels (6 ticks)
  const xLabels = ['48h', '40h', '32h', '24h', '16h', '8h', 'Now'];
  const xTicks = xLabels.map((label, i) => ({
    x: padLeft + (i / (xLabels.length - 1)) * chartW,
    label,
  }));

  return (
    <div className={`w-full rounded-xl overflow-hidden ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line key={`grid-y-${i}`}
            x1={padLeft} y1={tick.y}
            x2={svgWidth - padRight} y2={tick.y}
            stroke={isDark ? '#374151' : '#e5e7eb'}
            strokeWidth="0.5"
            strokeDasharray="4,4" />
        ))}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${chartId})`} />

        {/* Price line */}
        <path d={pathD} fill="none" stroke={strokeColor}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Current price dot */}
        <circle cx={getX(points.length - 1)} cy={getY(points[points.length - 1])}
          r="3.5" fill={strokeColor} stroke="white" strokeWidth="1.5" />

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text key={`y-${i}`} x={padLeft - 6} y={tick.y + 3.5}
            textAnchor="end" fill={isDark ? '#6b7280' : '#9ca3af'}
            fontSize="8" fontFamily="monospace" fontWeight="500">
            {tick.label}
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick, i) => (
          <text key={`x-${i}`} x={tick.x} y={svgHeight - 6}
            textAnchor="middle" fill={isDark ? '#6b7280' : '#9ca3af'}
            fontSize="7" fontFamily="monospace">
            {tick.label}
          </text>
        ))}

        {/* Y-axis line */}
        <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + chartH}
          stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1" />

        {/* X-axis line */}
        <line x1={padLeft} y1={padTop + chartH}
          x2={svgWidth - padRight} y2={padTop + chartH}
          stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1" />
      </svg>
    </div>
  );
}

export default PriceChart;