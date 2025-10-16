import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Scale, Pill, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useHealthRecords } from "@/hooks/useHealthRecords";

const Dashboard = () => {
  const { thyroidRecords, otherMetrics } = useHealthRecords();
  
  const recentMetrics = thyroidRecords.slice(0, 3);

  const latestHeartRate = otherMetrics.find(m => m.type === 'heartRate');
  const latestWeight = otherMetrics.find(m => m.type === 'weight');
  const todayMedication = otherMetrics.filter(m => 
    m.type === 'medication' && m.date === new Date().toISOString().split('T')[0]
  ).length;

  const quickStats = [
    { icon: Heart, label: "心率", value: latestHeartRate?.value.toString() || "--", unit: "bpm", color: "text-chart-2" },
    { icon: Scale, label: "体重", value: latestWeight?.value.toString() || "--", unit: "kg", color: "text-chart-1" },
    { icon: Pill, label: "今日用药", value: todayMedication.toString(), unit: "次", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold mb-2">健康管理</h1>
        <p className="text-primary-foreground/90">甲亢健康监测助手</p>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card p-4 shadow-md">
                <Icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.unit}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Metrics */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">最近指标</h2>
          <Link to="/records">
            <Button variant="ghost" size="sm" className="text-primary">
              查看全部 <TrendingUp className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card className="bg-card p-5 shadow-md">
          {recentMetrics.length > 0 ? (
            <div className="space-y-4">
              {recentMetrics.map((metric) => (
                <div key={metric.id} className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">{metric.date}</div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-chart-1 font-medium">FT3: {metric.ft3}</span>
                    <span className="text-chart-2 font-medium">FT4: {metric.ft4}</span>
                    <span className="text-chart-3 font-medium">TSH: {metric.tsh}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              暂无记录，请添加您的第一条健康记录
            </div>
          )}
          <Link to="/records/add">
            <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
              <Plus className="mr-2 h-4 w-4" />
              添加新记录
            </Button>
          </Link>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4">今日待办</h2>
        <Card className="bg-card p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Pill className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground">早餐后服药</span>
            </div>
            <input type="checkbox" className="h-5 w-5 rounded border-border" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-foreground">饮食打卡</span>
            </div>
            <input type="checkbox" className="h-5 w-5 rounded border-border" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <span className="text-foreground">心率检测</span>
            </div>
            <input type="checkbox" className="h-5 w-5 rounded border-border" />
          </div>
          <Link to="/reminders">
            <Button variant="outline" className="w-full mt-2">
              查看所有提醒
            </Button>
          </Link>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
