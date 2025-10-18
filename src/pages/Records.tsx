import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const Records = () => {
  const data = [
    { date: "12/15", ft3: 4.2, ft4: 15.3, tsh: 0.8 },
    { date: "12/22", ft3: 4.5, ft4: 15.8, tsh: 0.7 },
    { date: "12/29", ft3: 4.8, ft4: 16.2, tsh: 0.6 },
    { date: "01/05", ft3: 4.6, ft4: 15.9, tsh: 0.65 },
    { date: "01/12", ft3: 4.3, ft4: 15.5, tsh: 0.75 },
  ];

  const metrics = [
    { label: "FT3", value: "4.3", unit: "pmol/L", range: "3.1-6.8", status: "normal" },
    { label: "FT4", value: "15.5", unit: "pmol/L", range: "12.0-22.0", status: "normal" },
    { label: "TSH", value: "0.75", unit: "mIU/L", range: "0.27-4.2", status: "normal" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">健康档案</h1>
        <p className="text-primary-foreground/90">甲状腺功能指标追踪</p>
      </div>

      {/* Current Metrics */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-4">最新指标</h2>
        <Card className="bg-card p-5 shadow-md">
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-foreground text-lg">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">参考范围: {metric.range}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">趋势图表</h2>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <Card className="bg-card p-5 shadow-md">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ft3"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
                name="FT3"
              />
              <Line
                type="monotone"
                dataKey="ft4"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
                name="FT4"
              />
              <Line
                type="monotone"
                dataKey="tsh"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))" }}
                name="TSH"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Other Records */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-4">其他记录</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card p-4 shadow-md">
            <div className="text-muted-foreground text-sm mb-1">心率</div>
            <div className="text-2xl font-bold text-chart-2">78</div>
            <div className="text-xs text-muted-foreground">bpm</div>
          </Card>
          <Card className="bg-card p-4 shadow-md">
            <div className="text-muted-foreground text-sm mb-1">体重</div>
            <div className="text-2xl font-bold text-chart-1">65.5</div>
            <div className="text-xs text-muted-foreground">kg</div>
          </Card>
        </div>
      </div>

      {/* Add Record Button */}
      <div className="px-6 mt-6">
        <Link to="/records/add">
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity py-6">
            <Plus className="mr-2 h-5 w-5" />
            添加新记录
          </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
};

export default Records;
