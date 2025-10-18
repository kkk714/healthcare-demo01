import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChefHat, Flame, Fish } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const Recipes = () => {
  const recipes = [
    {
      id: 1,
      name: "清蒸鲈鱼",
      category: "低碘饮食",
      calories: 280,
      protein: 32,
      iodine: "低",
      image: "🐟",
      tags: ["高蛋白", "低碘"],
    },
    {
      id: 2,
      name: "番茄炒蛋",
      category: "均衡营养",
      calories: 220,
      protein: 15,
      iodine: "低",
      image: "🍅",
      tags: ["维生素", "低碘"],
    },
    {
      id: 3,
      name: "鸡胸肉沙拉",
      category: "健康轻食",
      calories: 320,
      protein: 38,
      iodine: "极低",
      image: "🥗",
      tags: ["高蛋白", "低脂"],
    },
    {
      id: 4,
      name: "蔬菜炖豆腐",
      category: "低碘饮食",
      calories: 180,
      protein: 12,
      iodine: "低",
      image: "🥦",
      tags: ["植物蛋白", "低碘"],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">食谱推荐</h1>
        <p className="text-primary-foreground/90">科学营养，健康饮食</p>
      </div>

      {/* AI Assistant Button */}
      <div className="px-6 mt-6">
        <Link to="/recipes/chat">
          <Card className="bg-gradient-primary p-5 shadow-md hover:opacity-90 transition-opacity cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-bold text-lg">AI 饮食助手</h3>
                <p className="text-sm text-white/90">告诉我您想吃什么，我来推荐适合您的食谱</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Search */}
      <div className="px-6 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="搜索食谱..."
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge variant="default" className="bg-primary text-primary-foreground whitespace-nowrap">全部</Badge>
          <Badge variant="outline" className="whitespace-nowrap">低碘饮食</Badge>
          <Badge variant="outline" className="whitespace-nowrap">高蛋白</Badge>
          <Badge variant="outline" className="whitespace-nowrap">低脂餐</Badge>
        </div>
      </div>

      {/* Recipes List */}
      <div className="px-6 mt-6 space-y-4">
        {recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
            <Card className="bg-card p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="text-6xl">{recipe.image}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{recipe.name}</h3>
                  <div className="flex gap-2 mb-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Flame className="h-3 w-3 text-accent" />
                      <span>{recipe.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ChefHat className="h-3 w-3 text-chart-1" />
                      <span>{recipe.protein}g 蛋白</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Fish className="h-3 w-3 text-chart-2" />
                      <span>{recipe.iodine}碘</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Recipes;
