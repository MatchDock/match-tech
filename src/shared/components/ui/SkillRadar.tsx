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

const DIMS = { sm: 192, md: 256, lg: 320 } as const;
const OUTER_RADIUS = { sm: "65%", md: "70%", lg: "75%" } as const;

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  fontSize?: number;
}

const CustomTick = memo(function CustomTick({ x, y, payload, fontSize = 10 }: CustomTickProps) {
  return (
    <text x={x} y={y} fill="#000000" fontSize={fontSize} fontWeight="900" textAnchor="middle">
      {payload?.value}
    </text>
  );
});

const SkillRadar = memo(
  function SkillRadar({ skills, size = "md" }: SkillRadarProps) {
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

    const chartSize = DIMS[size];
    const outerRadius = OUTER_RADIUS[size];
    const fontSize = size === "sm" ? 9 : size === "md" ? 10 : 12;

    const tickElement = useMemo(() => <CustomTick fontSize={fontSize} />, [fontSize]);

    return (
      <div
        className="w-full relative overflow-hidden bg-neo-bg flex items-center justify-center"
        style={{ height: chartSize, minHeight: chartSize }}
      >
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
          <PolarAngleAxis dataKey="subject" tick={tickElement} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#B8FF29"
            strokeWidth={3}
            fill="#B8FF29"
            fillOpacity={0.4}
            isAnimationActive={false}
          />
        </RadarChart>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.size !== nextProps.size) return false;
    const p = prevProps.skills;
    const n = nextProps.skills;
    if (!p && !n) return true;
    if (!p || !n) return false;
    return (
      p.frontend === n.frontend &&
      p.backend === n.backend &&
      p.ux_ui === n.ux_ui &&
      p.dados === n.dados &&
      p.hardware_android === n.hardware_android &&
      p.vibe_coding === n.vibe_coding
    );
  },
);

export default SkillRadar;
