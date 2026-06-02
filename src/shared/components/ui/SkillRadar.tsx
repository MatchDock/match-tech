import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";

interface SkillRadarProps {
  skills: {
    frontend: number;
    backend: number;
    ux_ui: number;
    dados: number;
    hardware_android: number;
    vibe_coding: number;
  };
  size?: "sm" | "md" | "lg";
}

export default function SkillRadar({ skills, size = "md" }: SkillRadarProps) {
  const data = [
    { subject: "Front", A: skills?.frontend || 0 },
    { subject: "Back", A: skills?.backend || 0 },
    { subject: "UX/UI", A: skills?.ux_ui || 0 },
    { subject: "Dados", A: skills?.dados || 0 },
    { subject: "Hard", A: skills?.hardware_android || 0 },
    { subject: "Vibe AI", A: skills?.vibe_coding || 0 },
  ];

  // Tamanhos fixos por prop — sem ResponsiveContainer para evitar o bug width/height = -1
  const dims = { sm: 192, md: 256, lg: 320 };
  const chartSize = dims[size];
  const fontSize = size === "sm" ? 9 : size === "md" ? 10 : 12;
  const outerRadius = size === "sm" ? "65%" : size === "md" ? "70%" : "75%";

  return (
    <div
      className="w-full relative overflow-hidden bg-neo-bg flex items-center justify-center"
      style={{ height: chartSize, minHeight: chartSize }}
    >
      {/* Background Grid Pattern Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />

      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius={outerRadius}
        width={chartSize}
        height={chartSize}
        data={data}
      >
        <PolarGrid stroke="#000000" strokeWidth={1} strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fill: "#000000",
            fontSize: fontSize,
            fontWeight: "900",
            textAnchor: "middle",
          }}
        />
        <Radar
          name="Skills"
          dataKey="A"
          stroke="#B8FF29"
          strokeWidth={3}
          fill="#B8FF29"
          fillOpacity={0.4}
        />
      </RadarChart>
    </div>
  );
}
