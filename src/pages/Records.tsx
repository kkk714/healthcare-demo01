import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Plus, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Records = () => {
  const { toast } = useToast();
  const { thyroidRecords, otherMetrics, medicationChanges, addMetric, updateMetric, deleteMetric, addMedicationChange, updateMedicationChange, deleteMedicationChange } = useHealthRecords();
  
  const [metricDialog, setMetricDialog] = useState(false);
  const [medicationDialog, setMedicationDialog] = useState(false);
  const [editingMetric, setEditingMetric] = useState<any>(null);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  
  const [metricForm, setMetricForm] = useState({ type: 'heartRate', date: new Date().toISOString().split('T')[0], value: '', note: '' });
  const [medicationForm, setMedicationForm] = useState({ date: new Date().toISOString().split('T')[0], medicationName: '', dosage: '' });

  const chartData = thyroidRecords.slice(0, 10).reverse().map(r => ({
    date: r.date.slice(5),
    ft3: r.ft3,
    ft4: r.ft4,
    tsh: r.tsh,
  }));

  const latestRecord = thyroidRecords[0];
  const metrics = latestRecord ? [
    { label: "FT3", value: latestRecord.ft3.toFixed(1), unit: "pmol/L", range: "3.1-6.8" },
    { label: "FT4", value: latestRecord.ft4.toFixed(1), unit: "pmol/L", range: "12.0-22.0" },
    { label: "TSH", value: latestRecord.tsh.toFixed(2), unit: "mIU/L", range: "0.27-4.2" },
  ] : [];

  const heartRateRecords = otherMetrics.filter(m => m.type === 'heartRate');
  const weightRecords = otherMetrics.filter(m => m.type === 'weight');

  const handleSaveMetric = () => {
    if (!metricForm.value) {
      toast({ title: "请填写数值", variant: "destructive" });
      return;
    }

    if (editingMetric) {
      updateMetric(editingMetric.id, {
        date: metricForm.date,
        value: parseFloat(metricForm.value),
        note: metricForm.note,
      });
      toast({ title: "更新成功" });
    } else {
      addMetric({
        type: metricForm.type as any,
        date: metricForm.date,
        value: parseFloat(metricForm.value),
        unit: metricForm.type === 'heartRate' ? 'bpm' : 'kg',
        note: metricForm.note,
      });
      toast({ title: "添加成功" });
    }
    setMetricDialog(false);
    setEditingMetric(null);
    setMetricForm({ type: 'heartRate', date: new Date().toISOString().split('T')[0], value: '', note: '' });
  };

  const handleSaveMedication = () => {
    if (!medicationForm.medicationName || !medicationForm.dosage) {
      toast({ title: "请填写完整信息", variant: "destructive" });
      return;
    }

    if (editingMedication) {
      updateMedicationChange(editingMedication.id, medicationForm);
      toast({ title: "更新成功" });
    } else {
      addMedicationChange(medicationForm);
      toast({ title: "添加成功" });
    }
    setMedicationDialog(false);
    setEditingMedication(null);
    setMedicationForm({ date: new Date().toISOString().split('T')[0], medicationName: '', dosage: '' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">健康档案</h1>
        <p className="text-primary-foreground/90">甲状腺功能指标追踪</p>
      </div>

      {/* Current Metrics */}
      {latestRecord && (
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
      )}

      {/* Trend Chart */}
      {chartData.length > 0 && (
        <div className="px-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">趋势图表</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <Card className="bg-card p-5 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                
                {/* Reference lines for normal ranges */}
                <ReferenceLine y={3.1} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: 'FT3下限', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <ReferenceLine y={6.8} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: 'FT3上限', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                
                <Line
                  type="monotone"
                  dataKey="ft3"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))" }}
                  name="FT3 (3.1-6.8)"
                />
                <Line
                  type="monotone"
                  dataKey="ft4"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))" }}
                  name="FT4 (12-22)"
                />
                <Line
                  type="monotone"
                  dataKey="tsh"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-3))" }}
                  name="TSH (0.27-4.2)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Other Records with CRUD */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">其他记录</h2>
          <Dialog open={metricDialog} onOpenChange={setMetricDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary" onClick={() => {
                setEditingMetric(null);
                setMetricForm({ type: 'heartRate', date: new Date().toISOString().split('T')[0], value: '', note: '' });
              }}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{editingMetric ? '编辑记录' : '添加记录'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>类型</Label>
                  <select 
                    className="w-full mt-2 p-2 bg-background border border-border rounded-md text-foreground"
                    value={metricForm.type}
                    onChange={(e) => setMetricForm({...metricForm, type: e.target.value})}
                    disabled={!!editingMetric}
                  >
                    <option value="heartRate">心率</option>
                    <option value="weight">体重</option>
                  </select>
                </div>
                <div>
                  <Label>日期</Label>
                  <Input 
                    type="date" 
                    value={metricForm.date}
                    onChange={(e) => setMetricForm({...metricForm, date: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>数值 ({metricForm.type === 'heartRate' ? 'bpm' : 'kg'})</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={metricForm.value}
                    onChange={(e) => setMetricForm({...metricForm, value: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>备注</Label>
                  <Input 
                    value={metricForm.note}
                    onChange={(e) => setMetricForm({...metricForm, note: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleSaveMetric} className="w-full bg-gradient-primary">
                  保存
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="heartRate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="heartRate">心率</TabsTrigger>
            <TabsTrigger value="weight">体重</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heartRate">
            <Card className="bg-card p-4 shadow-md">
              {heartRateRecords.length > 0 ? (
                <div className="space-y-3">
                  {heartRateRecords.map((record) => (
                    <div key={record.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="text-foreground font-medium">{record.value} bpm</div>
                        <div className="text-xs text-muted-foreground">{record.date}</div>
                        {record.note && <div className="text-xs text-muted-foreground mt-1">{record.note}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setEditingMetric(record);
                          setMetricForm({ type: record.type, date: record.date, value: record.value.toString(), note: record.note || '' });
                          setMetricDialog(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          deleteMetric(record.id);
                          toast({ title: "删除成功" });
                        }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无心率记录</div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="weight">
            <Card className="bg-card p-4 shadow-md">
              {weightRecords.length > 0 ? (
                <div className="space-y-3">
                  {weightRecords.map((record) => (
                    <div key={record.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="text-foreground font-medium">{record.value} kg</div>
                        <div className="text-xs text-muted-foreground">{record.date}</div>
                        {record.note && <div className="text-xs text-muted-foreground mt-1">{record.note}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => {
                          setEditingMetric(record);
                          setMetricForm({ type: record.type, date: record.date, value: record.value.toString(), note: record.note || '' });
                          setMetricDialog(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          deleteMetric(record.id);
                          toast({ title: "删除成功" });
                        }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无体重记录</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Medication Changes */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">用药变化记录</h2>
          <Dialog open={medicationDialog} onOpenChange={setMedicationDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary" onClick={() => {
                setEditingMedication(null);
                setMedicationForm({ date: new Date().toISOString().split('T')[0], medicationName: '', dosage: '' });
              }}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>{editingMedication ? '编辑用药记录' : '添加用药记录'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>日期</Label>
                  <Input 
                    type="date" 
                    value={medicationForm.date}
                    onChange={(e) => setMedicationForm({...medicationForm, date: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>药品名称</Label>
                  <Input 
                    value={medicationForm.medicationName}
                    onChange={(e) => setMedicationForm({...medicationForm, medicationName: e.target.value})}
                    placeholder="例如：甲巯咪唑片"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>剂量</Label>
                  <Input 
                    value={medicationForm.dosage}
                    onChange={(e) => setMedicationForm({...medicationForm, dosage: e.target.value})}
                    placeholder="例如：10mg 每日2次"
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleSaveMedication} className="w-full bg-gradient-primary">
                  保存
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card p-4 shadow-md">
          {medicationChanges.length > 0 ? (
            <div className="space-y-3">
              {medicationChanges.map((med) => (
                <div key={med.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-foreground font-medium">{med.medicationName}</div>
                    <div className="text-sm text-muted-foreground">{med.dosage}</div>
                    <div className="text-xs text-muted-foreground mt-1">{med.date}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setEditingMedication(med);
                      setMedicationForm({ date: med.date, medicationName: med.medicationName, dosage: med.dosage });
                      setMedicationDialog(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      deleteMedicationChange(med.id);
                      toast({ title: "删除成功" });
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">暂无用药变化记录</div>
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
