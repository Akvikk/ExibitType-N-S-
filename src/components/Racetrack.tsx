import React, { useMemo } from 'react';
import { getFillClass, getNumClass } from '../utils/colors';
import { InputMode } from '../hooks/useRouletteSession';

interface RacetrackProps {
  selectedNumber: number | null;
  onSelect: (n: number) => void;
  inputMode: InputMode;
  activeBets: number[];
}

export const Racetrack: React.FC<RacetrackProps> = ({ selectedNumber, onSelect, inputMode, activeBets }) => {
  const trackData = useMemo(() => {
    const cx = 120, cy_top = 140, cy_bottom = 540, r_out = 90, r_in = 50;
    const L = cy_bottom - cy_top;

    const leftNumbers = [30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19];
    const bottomNumbers = [15, 32, 0, 26, 3];
    const rightNumbers = [35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16];
    const topNumbers = [24, 5, 10, 23, 8];

    const segments: any[] = [];

    // Left straight
    const leftH = L / leftNumbers.length;
    leftNumbers.forEach((num, i) => {
      const y1 = cy_top + i * leftH;
      const y2 = cy_top + (i + 1) * leftH;
      segments.push({
        num,
        path: `M ${cx - r_out} ${y1} L ${cx - r_in} ${y1} L ${cx - r_in} ${y2} L ${cx - r_out} ${y2} Z`,
        textX: cx - (r_out + r_in) / 2,
        textY: y1 + leftH / 2,
        textRot: 90
      });
    });

    // Right straight
    const rightH = L / rightNumbers.length;
    rightNumbers.forEach((num, i) => {
      const y1 = cy_bottom - i * rightH;
      const y2 = cy_bottom - (i + 1) * rightH;
      segments.push({
        num,
        path: `M ${cx + r_in} ${y1} L ${cx + r_out} ${y1} L ${cx + r_out} ${y2} L ${cx + r_in} ${y2} Z`,
        textX: cx + (r_out + r_in) / 2,
        textY: y1 - rightH / 2,
        textRot: -90
      });
    });

    const pt = (cx: number, cy: number, r: number, a: number) => ({
      x: cx + r * Math.cos(a * Math.PI / 180),
      y: cy - r * Math.sin(a * Math.PI / 180)
    });

    // Top curve
    topNumbers.forEach((num, i) => {
      const a1 = i * 36;
      const a2 = (i + 1) * 36;
      const p1_out = pt(cx, cy_top, r_out, a1);
      const p2_out = pt(cx, cy_top, r_out, a2);
      const p1_in = pt(cx, cy_top, r_in, a1);
      const p2_in = pt(cx, cy_top, r_in, a2);
      segments.push({
        num,
        path: `M ${p1_out.x} ${p1_out.y} A ${r_out} ${r_out} 0 0 0 ${p2_out.x} ${p2_out.y} L ${p2_in.x} ${p2_in.y} A ${r_in} ${r_in} 0 0 1 ${p1_in.x} ${p1_in.y} Z`,
        textX: pt(cx, cy_top, (r_out + r_in) / 2, a1 + 18).x,
        textY: pt(cx, cy_top, (r_out + r_in) / 2, a1 + 18).y,
        textRot: 90 - (a1 + 18)
      });
    });

    // Bottom curve
    bottomNumbers.forEach((num, i) => {
      const a1 = 180 + i * 36;
      const a2 = 180 + (i + 1) * 36;
      const p1_out = pt(cx, cy_bottom, r_out, a1);
      const p2_out = pt(cx, cy_bottom, r_out, a2);
      const p1_in = pt(cx, cy_bottom, r_in, a1);
      const p2_in = pt(cx, cy_bottom, r_in, a2);
      segments.push({
        num,
        path: `M ${p1_out.x} ${p1_out.y} A ${r_out} ${r_out} 0 0 0 ${p2_out.x} ${p2_out.y} L ${p2_in.x} ${p2_in.y} A ${r_in} ${r_in} 0 0 1 ${p1_in.x} ${p1_in.y} Z`,
        textX: pt(cx, cy_bottom, (r_out + r_in) / 2, a1 + 18).x,
        textY: pt(cx, cy_bottom, (r_out + r_in) / 2, a1 + 18).y,
        textRot: 90 - (a1 + 18)
      });
    });

    return { segments, cx, cy_top, cy_bottom, r_in, r_out, leftH, rightH };
  }, []);

  const { segments, cx, cy_top, cy_bottom, r_in, leftH, rightH } = trackData;

  const handleNumberClick = (num: number) => {
    if (inputMode === 'HYBRID') {
      onSelect(num);
    }
  };

  return (
    <div className="hidden md:flex justify-center items-center bg-[#0f0f13] border-l border-gray-800/50 shrink-0 h-full overflow-hidden">
      <div className="racetrack-shell flex justify-center items-center h-full w-full p-1">
        <svg viewBox="28 48 184 584" className="roulette-racetrack h-full w-auto max-h-full">
          {/* Inner Background */}
          <path d={`M ${cx - r_in} ${cy_top} L ${cx - r_in} ${cy_bottom} A ${r_in} ${r_in} 0 0 0 ${cx + r_in} ${cy_bottom} L ${cx + r_in} ${cy_top} A ${r_in} ${r_in} 0 0 0 ${cx - r_in} ${cy_top} Z`} fill="#151922" />

          {/* Dividing Lines */}
          <line x1={cx - r_in} y1={cy_top + 5 * leftH} x2={cx + r_in} y2={cy_bottom - 12 * rightH} stroke="#e8d5a5" strokeWidth="1.5" />
          <line x1={cx - r_in} y1={cy_top + 8 * leftH} x2={cx + r_in} y2={cy_bottom - 7 * rightH} stroke="#e8d5a5" strokeWidth="1.5" />

          {/* ZERO Oval */}
          <rect x={cx - r_in + 12} y={cy_bottom - 3.5 * rightH} width={r_in * 2 - 24} height={r_in + 3.5 * rightH - 12} rx={(r_in * 2 - 24) / 2} fill="none" stroke="#e8d5a5" strokeWidth="1.5" />

          {/* Labels */}
          <text x={cx} y={cy_top + 2 * leftH} className="rt-label" transform={`rotate(90, ${cx}, ${cy_top + 2 * leftH})`}>TIER</text>
          <text x={cx} y={cy_top + 6.5 * leftH} className="rt-label" transform={`rotate(90, ${cx}, ${cy_top + 6.5 * leftH})`}>ORPHELINS</text>
          <text x={cx} y={cy_top + 11 * leftH} className="rt-label" transform={`rotate(90, ${cx}, ${cy_top + 11 * leftH})`}>VOISINS</text>
          <text x={cx} y={cy_bottom} className="rt-label" transform={`rotate(90, ${cx}, ${cy_bottom})`}>ZERO</text>

          {/* Segments */}
          {segments.map(({ num, path, textX, textY, textRot }) => (
            <g 
              key={num} 
              onClick={() => handleNumberClick(num)} 
              className={`rt-seg ${inputMode === 'HYBRID' ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                transformOrigin: `${textX}px ${textY}px`,
                transform: activeBets.includes(num) ? 'scale(1.08) translateZ(0)' : 'scale(1) translateZ(0)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <path 
                d={path} 
                className={getFillClass(num)} 
                stroke={activeBets.includes(num) ? "#facc15" : "#e8d5a5"} 
                strokeWidth={activeBets.includes(num) ? "3" : "1.5"} 
                style={{
                  filter: activeBets.includes(num) ? 'drop-shadow(0px 8px 12px rgba(250,204,21,0.6))' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <text 
                x={textX} 
                y={textY} 
                transform={`rotate(${textRot}, ${textX}, ${textY})`} 
                className={`rt-num ${getNumClass(num)}`}
                style={{
                  fill: activeBets.includes(num) ? '#facc15' : '',
                  textShadow: activeBets.includes(num) ? '0 2px 4px rgba(0,0,0,0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {num}
              </text>
              {selectedNumber === num && <path d={path} fill="none" stroke="#fff" strokeWidth="3" />}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
