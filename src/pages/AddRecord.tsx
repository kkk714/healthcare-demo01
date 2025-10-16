import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddRecord = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ft3: "",
    ft4: "",
    tsh: "",
    heartRate: "",
    weight: "",
    medication: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("记录已保存");
    navigate("/records");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">添加健康记录</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-6">
        {/* Date */}
        <Card className="bg-card p-5 shadow-md">
          <Label htmlFor="date" className="text-foreground font-medium mb-2 block">日期</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="bg-background border-border"
          />
        </Card>

        {/* Thyroid Metrics */}
        <Card className="bg-card p-5 shadow-md">
          <h3 className="text-foreground font-bold mb-4">甲状腺功能</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ft3" className="text-muted-foreground text-sm mb-2 block">
                FT3 (pmol/L) <span className="text-xs">参考: 3.1-6.8</span>
              </Label>
              <Input
                id="ft3"
                type="number"
                step="0.1"
                placeholder="输入FT3值"
                value={formData.ft3}
                onChange={(e) => handleChange("ft3", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="ft4" className="text-muted-foreground text-sm mb-2 block">
                FT4 (pmol/L) <span className="text-xs">参考: 12.0-22.0</span>
              </Label>
              <Input
                id="ft4"
                type="number"
                step="0.1"
                placeholder="输入FT4值"
                value={formData.ft4}
                onChange={(e) => handleChange("ft4", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="tsh" className="text-muted-foreground text-sm mb-2 block">
                TSH (mIU/L) <span className="text-xs">参考: 0.27-4.2</span>
              </Label>
              <Input
                id="tsh"
                type="number"
                step="0.01"
                placeholder="输入TSH值"
                value={formData.tsh}
                onChange={(e) => handleChange("tsh", e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
        </Card>

        {/* Other Metrics */}
        <Card className="bg-card p-5 shadow-md">
          <h3 className="text-foreground font-bold mb-4">其他指标</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="heartRate" className="text-muted-foreground text-sm mb-2 block">心率 (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="输入心率"
                value={formData.heartRate}
                onChange={(e) => handleChange("heartRate", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-muted-foreground text-sm mb-2 block">体重 (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="输入体重"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
        </Card>

        {/* Medication */}
        <Card className="bg-card p-5 shadow-md">
          <h3 className="text-foreground font-bold mb-4">用药记录</h3>
          <Label htmlFor="medication" className="text-muted-foreground text-sm mb-2 block">备注</Label>
          <Input
            id="medication"
            type="text"
            placeholder="例如: 赛治 5mg 1片/天"
            value={formData.medication}
            onChange={(e) => handleChange("medication", e.target.value)}
            className="bg-background border-border"
          />
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity py-6">
          <Save className="mr-2 h-5 w-5" />
          保存记录
        </Button>
      </form>
    </div>
  );
};

export default AddRecord;
