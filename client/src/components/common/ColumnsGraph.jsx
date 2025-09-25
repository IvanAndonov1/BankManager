
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cushion", value: 0 },
  { name: "Tenure", value: 100 },
  { name: "Dti", value: 100 },
  { name: "Debt", value: 100 },
  { name: "Age", value: 20 },

];

export default function ColumnsGraph() {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis domain={[0, 500]} />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" barSize={40}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
