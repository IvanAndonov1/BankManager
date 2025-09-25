import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function SuggestRing() {
  const value = 70; 
  const data = [{ name: "progress", value }, { name: "rest", value: 100 - value }];

  return (
    <div style={{ width: 250, height: 200, position: "relative" }}>
      <ResponsiveContainer>
        <PieChart>
          <defs>
         
            <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="green" />
             
              <stop offset="100%" stopColor="red" />
            </linearGradient>
          </defs>

          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={100}
            stroke="none"
          >
          
            <Cell key="progress" fill="url(#colorGradient)" />
          
            <Cell key="rest" fill="#eee" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

    
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {value}%
      </div>
    </div>
  );
}
