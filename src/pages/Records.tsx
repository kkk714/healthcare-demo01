import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Plus, TrendingUp, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Records = () => {
  const { thyroidRecords, medicationChanges, addMedicationChange, deleteMedicationChange } = useHealthRecords();
  const { toast } = useToast();
  const [medDialogOpen, setMedDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    date: new Date().toISOString().split('T')[0],
    medicationName: '',
    dosage: '',
    notes: '',
  });

  const data = thyroidRecords
    .slice(0, 10)
    .reverse()
    .map(record => ({
      date: record.date.substring(5),
      ft3: record.ft3,
      ft4: record.ft4,
      tsh: record.tsh,
    }));

  const latestRecord = thyroidRecords[0];
  const metrics = latestRecord ? [
    { label: "FT3", value: latestRecord.ft3.toString(), unit: "pmol/L", range: "3.1-6.8", status: "normal" },
    { label: "FT4", value: latestRecord.ft4.toString(), unit: "pmol/L", range: "12.0-22.0", status: "normal" },
    { label: "TSH", value: latestRecord.tsh.toString(), unit: "mIU/L", range: "0.27-4.2", status: "normal" },
  ] : [];

  const handleAddMedication = () => {
    if (newMedication.medicationName && newMedication.dosage) {
      addMedicationChange(newMedication);
      setNewMedication({
        date: new Date().toISOString().split('T')[0],
        medicationName: '',
        dosage: '',
        notes: '',
      });
      setMedDialogOpen(false);
      toast({
        title: "用药记录已添加",
        description: "用药变化已成功保存",
      });
    }
  };

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
        {metrics.length > 0 ? (
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
        ) : (
          <Card className="bg-card p-5 shadow-md">
            <div className="text-center text-muted-foreground">暂无记录数据</div>
          </Card>
        )}
      </div>

      {/* Trend Chart */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">趋势图表</h2>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <Card className="bg-card p-5 shadow-md">
          {data.length > 0 ? (
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
                <ReferenceLine y={3.1} stroke="hsl(var(--chart-1))" strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={6.8} stroke="hsl(var(--chart-1))" strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={12.0} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={22.0} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" strokeOpacity={0.3} />
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
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              暂无趋势数据
            </div>
          )}
        </Card>
      </div>

      {/* Medication Changes */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">用药变化记录</h2>
          <Dialog open={medDialogOpen} onOpenChange={setMedDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>添加用药记录</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>日期</Label>
                  <Input
                    type="date"
                    value={newMedication.date}
                    onChange={(e) => setNewMedication({ ...newMedication, date: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>药品名称</Label>
                  <Input
                    value={newMedication.medicationName}
                    onChange={(e) => setNewMedication({ ...newMedication, medicationName: e.target.value })}
                    placeholder="例如：甲巯咪唑"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>剂量</Label>
                  <Input
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="例如：10mg 每日三次"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>备注（可选）</Label>
                  <Input
                    value={newMedication.notes}
                    onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                    placeholder="其他说明"
                    className="bg-background"
                  />
                </div>
                <Button onClick={handleAddMedication} className="w-full bg-gradient-primary hover:opacity-90">
                  保存
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="bg-card shadow-md overflow-hidden">
          {medicationChanges.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>药品名称</TableHead>
                  <TableHead>剂量</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicationChanges.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.date}</TableCell>
                    <TableCell>{med.medicationName}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteMedicationChange(med.id);
                          toast({ title: "已删除用药记录" });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              暂无用药变化记录
            </div>
          )}
        </Card>
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
