import React from "react";

import { LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer } from "recharts";

const MiniChart = ({ type, data, color }) => {
  const chartProps = {
    width: 56, // w-14 = 56px
    height: 40, // h-10 = 40px
    data,
  };

  const colorMap = {
    blue: "#4680FF",
    orange: "#E58A00", 
    green: "#4CB592",
    red: "#DC2626",
  };

  const strokeColor = colorMap[color] || color;

  switch (type) {
    case "line":
      return (
        <ResponsiveContainer width={56} height={40}>
          <LineChart {...chartProps}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer width={56} height={40}>
          <BarChart {...chartProps}>
            <Bar
              dataKey="value"
              fill={strokeColor}
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width={56} height={40}>
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={1.5}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <ResponsiveContainer width={56} height={40}>
          <LineChart {...chartProps}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
  }
};

export default MiniChart;