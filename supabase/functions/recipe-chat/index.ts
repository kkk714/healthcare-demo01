import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages = [], systemPrompt, healthContext } = await req.json();

    const API_KEY = Deno.env.get("SILICONFLOW_API_KEY");
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "SILICONFLOW_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseSystem = `你是一个专业的营养师助手，专门为甲亢患者提供饮食建议。\n\n甲亢饮食原则：\n1. 严格限制碘的摄入（避免海带、紫菜、海鱼、海虾等海产品）\n2. 增加热量摄入（甲亢患者代谢旺盛）\n3. 补充优质蛋白质（鸡蛋、牛奶、瘦肉、豆类）\n4. 补充维生素和矿物质\n5. 避免辛辣刺激性食物\n6. 戒烟戒酒、少喝浓茶咖啡\n\n请根据用户的需求和健康状况，给出详细的食谱建议，包括：\n- 食材清单（标注是否适合甲亢患者）\n- 烹饪步骤\n- 营养价值（热量、蛋白质、含碘量）\n- 注意事项`;

    const finalSystem = `${systemPrompt ?? baseSystem}\n\n${healthContext ?? ""}`.trim();

    const upstream = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/QwQ-32B",
        messages: [{ role: "system", content: finalSystem }, ...(Array.isArray(messages) ? messages : [])],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("SiliconFlow error:", upstream.status, text);
      return new Response(text, {
        status: upstream.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = await upstream.text();
    return new Response(text, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recipe-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
