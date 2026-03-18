import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const ATSScoreChart = ({ score = 0 }) => {
  const data = [
    {
      name: "ATS",
      value: score,
      fill: score > 75 ? "#10b981" : score > 55 ? "#0ea5e9" : "#f59e0b",
    },
  ];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="60%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={12} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="-mt-16 text-center">
        <p className="font-display text-4xl font-extrabold">{score}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          ATS Compatibility
        </p>
      </div>
    </div>
  );
};

export default ATSScoreChart;
