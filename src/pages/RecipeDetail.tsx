import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flame, ChefHat, Fish, Clock, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const RecipeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const recipe = {
    name: "清蒸鲈鱼",
    image: "🐟",
    description: "鲈鱼肉质鲜美，富含优质蛋白质，低碘，非常适合甲亢患者食用。",
    calories: 280,
    protein: 32,
    iodine: "低",
    servings: 2,
    cookTime: 20,
    tags: ["高蛋白", "低碘", "易消化"],
    nutrition: [
      { label: "热量", value: "280", unit: "kcal" },
      { label: "蛋白质", value: "32", unit: "g" },
      { label: "脂肪", value: "8", unit: "g" },
      { label: "碳水化合物", value: "5", unit: "g" },
      { label: "含碘量", value: "低", unit: "" },
    ],
    ingredients: [
      "鲈鱼 1条 (约500g)",
      "生姜 3片",
      "葱 2根",
      "料酒 1勺",
      "蒸鱼豉油 2勺",
      "食用油 少许",
    ],
    steps: [
      "鲈鱼清洗干净，在鱼身两侧各划几刀",
      "用料酒、姜片腌制10分钟去腥",
      "蒸锅水烧开后，放入鲈鱼",
      "大火蒸8-10分钟至熟透",
      "取出后淋上蒸鱼豉油",
      "热油浇在葱丝上即可",
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="text-8xl mb-4 text-center">{recipe.image}</div>
        <h1 className="text-2xl font-bold text-center">{recipe.name}</h1>
      </div>

      {/* Info Bar */}
      <div className="px-6 mt-6">
        <Card className="bg-card p-4 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Clock className="h-5 w-5 mx-auto mb-1 text-chart-2" />
              <div className="text-sm text-muted-foreground">烹饪时间</div>
              <div className="font-bold text-foreground">{recipe.cookTime}分钟</div>
            </div>
            <div>
              <Users className="h-5 w-5 mx-auto mb-1 text-chart-1" />
              <div className="text-sm text-muted-foreground">份量</div>
              <div className="font-bold text-foreground">{recipe.servings}人份</div>
            </div>
            <div>
              <Flame className="h-5 w-5 mx-auto mb-1 text-accent" />
              <div className="text-sm text-muted-foreground">热量</div>
              <div className="font-bold text-foreground">{recipe.calories} kcal</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tags */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 flex-wrap">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-6 mt-6">
        <Card className="bg-card p-5 shadow-md">
          <p className="text-foreground leading-relaxed">{recipe.description}</p>
        </Card>
      </div>

      {/* Nutrition */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-4">营养成分</h2>
        <Card className="bg-card p-5 shadow-md">
          <div className="space-y-3">
            {recipe.nutrition.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-bold text-foreground">
                  {item.value} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ingredients */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-foreground mb-4">所需食材</h2>
        <Card className="bg-card p-5 shadow-md">
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-foreground">{ingredient}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Steps */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">制作步骤</h2>
        <Card className="bg-card p-5 shadow-md">
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-foreground pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
