import { memo, useMemo } from "react";
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

// Wrapped in memo so the SVG only re-renders when skill values actually change.
// RadarChart is one of the most expensive Recharts components — memoisation is critical
// when multiple cards are visible simultaneously (e.g. guilda grid).
const SkillRadar = memo(function SkillRadar({ skills, size = "md" }: SkillRadarProps) {
  const data = useMemo(
    () => [
      { subject: "Front", A: skills?.frontend || 0 },
      { subject: "Back", A: skills?.backend || 0 },
      { subject: "UX/UI", A: skills?.ux_ui || 0 },
      { subject: "Dados", A: skills?.dados || 0 },
      { subject: "Hard", A: skills?.hardware_android || 0 },
      { subject: "Vibe AI", A: skills?.vibe_coding || 0 },
    ],
    [
      skills?.frontend,
      skills?.backend,
      skills?.ux_ui,
      skills?.dados,
      skills?.hardware_android,
      skills?.vibe_coding,
    ],
  );

  // Fixed dims — no ResponsiveContainer to avoid the width/height = -1 Recharts bug
  const dims = { sm: 192, md: 256, lg: 320 };
  const chartSize = dims[size];
  const fontSize = size === "sm" ? 9 : size === "md" ? 10 : 12;
  const outerRadius = size === "sm" ? "65%" : size === "md" ? "70%" : "75%";

  return (
    <div
      className="w-full relative overflow-hidden bg-neo-bg flex items-center justify-center"
      style={{ height: chartSize, minHeight: chartSize }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[12px_12px]" />
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
});

export default SkillRadar;
