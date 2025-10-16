import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pill, Utensils, Heart, Moon, Dumbbell, Bell } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const Reminders = () => {
  const tasks = [
    {
      id: 1,
      title: "早餐后服药",
      time: "08:30",
      icon: Pill,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      completed: true,
    },
    {
      id: 2,
      title: "午餐饮食打卡",
      time: "12:00",
      icon: Utensils,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      completed: true,
    },
    {
      id: 3,
      title: "心率检测",
      time: "14:00",
      icon: Heart,
      color: "text-accent",
      bgColor: "bg-accent/10",
      completed: false,
    },
    {
      id: 4,
      title: "晚餐后服药",
      time: "19:00",
      icon: Pill,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      completed: false,
    },
    {
      id: 5,
      title: "运动打卡",
      time: "20:00",
      icon: Dumbbell,
      color: "text-primary",
      bgColor: "bg-primary/10",
      completed: false,
    },
    {
      id: 6,
      title: "睡前记录",
      time: "22:00",
      icon: Moon,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      completed: false,
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">提醒与打卡</h1>
        <p className="text-primary-foreground/90">坚持每日健康习惯</p>
      </div>

      {/* Progress */}
      <div className="px-6 mt-6">
        <Card className="bg-card p-5 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-foreground font-bold">今日进度</h3>
            <span className="text-primary font-bold">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Tasks */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">待办事项</h2>
          <Button size="sm" variant="ghost" className="text-primary">
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <Card
                key={task.id}
                className={`bg-card p-4 shadow-md transition-opacity ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full ${task.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${task.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Bell className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.time}</span>
                    </div>
                  </div>
                  <Checkbox checked={task.completed} className="h-6 w-6" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="px-6 mt-6 mb-6">
        <Card className="bg-gradient-card p-5 shadow-md border-2 border-primary/20">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-foreground font-bold mb-1">健康小贴士</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                规律服药和饮食对甲亢控制很重要。建议每天固定时间服药，避免高碘食物，保持充足睡眠。
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reminders;
