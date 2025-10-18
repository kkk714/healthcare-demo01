import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const RecipeChat = () => {
  const { thyroidRecords } = useHealthRecords();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '您好！我是您的饮食助手。请告诉我您想吃什么，我会根据您的健康指标为您推荐适合的食谱。'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getHealthContext = () => {
    if (thyroidRecords.length === 0) {
      return "用户暂无健康记录。";
    }
    const latest = thyroidRecords[0];
    return `用户最新健康指标（${latest.date}）：FT3: ${latest.ft3} pmol/L (正常范围: 3.1-6.8), FT4: ${latest.ft4} pmol/L (正常范围: 12.0-22.0), TSH: ${latest.tsh} mIU/L (正常范围: 0.27-4.2)。用户患有甲亢，需要低碘饮食。`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `你是一个专业的营养师助手，专门为甲亢患者提供饮食建议。
      
甲亢饮食原则：
1. 严格限制碘的摄入（避免海带、紫菜、海鱼、海虾等海产品）
2. 增加热量摄入（甲亢患者代谢旺盛）
3. 补充优质蛋白质（鸡蛋、牛奶、瘦肉、豆类）
4. 补充维生素和矿物质
5. 避免辛辣刺激性食物
6. 戒烟戒酒、少喝浓茶咖啡

${getHealthContext()}

请根据用户的需求和健康状况，给出详细的食谱建议，包括：
- 食材清单（标注是否适合甲亢患者）
- 烹饪步骤
- 营养价值（热量、蛋白质、含碘量）
- 注意事项`;

      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-lpcrbzvlnrsrgfwqfgdlnzkvvhcihiykwdfcijvqfnpgaykw',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) >= messages.length - 5),
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0]?.message?.content || '抱歉，我暂时无法给出建议。'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "请求失败",
        description: "无法获取食谱推荐，请稍后重试",
        variant: "destructive",
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，服务暂时不可用。请稍后重试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-6 flex items-center gap-4">
        <Link to="/recipes">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">AI 饮食助手</h1>
          <p className="text-primary-foreground/90 text-sm">根据您的健康状况推荐食谱</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="告诉我您想吃什么..."
            className="flex-1 bg-card border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RecipeChat;
