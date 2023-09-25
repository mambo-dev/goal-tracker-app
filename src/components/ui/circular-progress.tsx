import React from "react";

type Props = {
  percentage: number;
  circleWidth: number;
  radius: number;
  strokeWidth: number;
};

export default function CircularProgress({
  circleWidth,
  percentage,
  radius,
  strokeWidth,
}: Props) {
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  return (
    <div>
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
      >
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={`${strokeWidth}px`}
          r={radius}
          className="fill-none stroke-gray-200"
        />
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={`${strokeWidth}px`}
          r={radius}
          className="fill-none stroke-purple-500  "
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2} )`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.4em"
          className="font-semibold text-lg text-slate-600"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}
