export const MODEL_GUIDE_VERIFIED_AT = "2026-10-27";

export const ARK_INVITE_URL = "https://volcengine.com/L/EXCINM7Q_JA/";
export const ARK_INVITE_CODE = "UBXND2JL";

export interface ModelPlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  renewal?: string;
  description: string;
  models: string[];
  fit: string;
  note: string;
  url: string;
  cta: string;
  invited: boolean;
  accent: "emerald" | "violet" | "sky" | "amber" | "slate";
}

export const modelPlans: ModelPlan[] = [
  {
    id: "ark",
    name: "方舟 Coding Plan",
    badge: "多模型低成本入门",
    price: "限时 9.9 元起",
    renewal: "Lite / Pro 原价分别为 40 / 200 元每月；当前优惠最多覆盖前两个月，第三个月起恢复原价。",
    description: "一个套餐覆盖多家国产模型，适合不想被单一模型绑定、又希望控制预算的开发者。",
    models: ["GLM-5.3 系列", "DeepSeek-V4.1-Flash 1017", "Doubao-Seed-Evolving"],
    fit: "多模型切换、日常高频编程、先低成本试用",
    note: "工具不限，但所有工具共享套餐额度；名额与活动资格以订购页为准。",
    url: ARK_INVITE_URL,
    cta: "立即订阅方舟",
    invited: true,
    accent: "emerald",
  },
  {
    id: "minimax",
    name: "MiniMax M Plan",
    badge: "MiniMax 全家桶",
    price: "Go 年付活动价 490 元",
    renewal: "另有 Explore 1,190 元/年、Build 4,690 元/年；页面同时展示划线价，最终以下单页为准。",
    description: "除 API Key 接入编程工具外，也包含 MiniMax Code 官方应用，适合希望网页、桌面和终端一起用的人。",
    models: ["M3.1 Flash", "图像与声音模型", "Explore / Build 含 H3 视频模型"],
    fit: "MiniMax 主力用户、编程与内容创作兼顾",
    note: "Go 为年付档位，不要把年付总价误读成月价；Free 档仅提供有限模型能力。",
    url: "https://platform.minimaxi.com/subscribe/coding-plan",
    cta: "查看 MiniMax 官方套餐",
    invited: false,
    accent: "violet",
  },
  {
    id: "glm",
    name: "GLM Coding Plan",
    badge: "GLM 主力开发",
    price: "Lite / Pro / Max 多档",
    renewal: "当前无可确认的邀请优惠；具体价格和积分以官方订阅页实时展示为准。",
    description: "适合明确偏好 GLM 模型、重视长上下文和复杂 Agent 任务的开发者。",
    models: ["GLM-5.3", "GLM-5.3-Flash", "1M 上下文"],
    fit: "复杂重构、长任务、GLM 生态用户",
    note: "套餐采用积分与用量窗口规则；不要只比较月费，也要比较积分和高峰时段消耗。",
    url: "https://www.bigmodel.cn/glm-coding",
    cta: "查看 GLM 官方套餐",
    invited: false,
    accent: "sky",
  },
  {
    id: "kimi",
    name: "Kimi 会员 · Kimi Code",
    badge: "已有会员更划算",
    price: "Plus 99 元/月起",
    renewal: "Plus 年付折合 79 元/月，需一次性支付全年费用；Go 档不包含 Kimi Code。",
    description: "如果你本来就需要 Kimi 的文档、研究、Agent 等会员能力，Plus 起可同时使用 Kimi Code。",
    models: ["Kimi Code", "Plus 及以上可用", "会员功能共享额度池"],
    fit: "已有或本来就想订阅 Kimi 会员的人",
    note: "新会员有滚动 5 小时限制和月度共享额度，无周限额；不是只为编程就不必盲目上高档。",
    url: "https://kimi-bot.com/activities/zh-cn/invite/share?scenario=subscribe&from=share_poster&invitation_code=RY2GMV",
    cta: "通过邀请订阅 Kimi",
    invited: true,
    accent: "slate",
  },
  {
    id: "bailian",
    name: "阿里云百炼 Coding Plan",
    badge: "高额度企业云生态",
    price: "Pro 200 元/月",
    renewal: "符合条件的新客首月 39.90 元，后续 200 元/月；每日限量补充名额。",
    description: "固定月费、多模型和较高请求额度，适合已经使用阿里云、且有高频交互式编程需求的人。",
    models: ["qwen3.7-plus", "kimi-k2.5", "glm-5 / MiniMax-M2.5"],
    fit: "高频开发、阿里云生态、需要明确请求额度",
    note: "仅限交互式编程工具；不支持退款，禁止共享账号或用于自动化批量 API 调用。",
    url: "https://help.aliyun.com/zh/model-studio/coding-plan",
    cta: "查看百炼官方套餐",
    invited: false,
    accent: "amber",
  },
];

export const apiPlans = [
  {
    name: "DeepSeek API",
    badge: "用量不稳定时更灵活",
    description: "当前通过 deepseek-flash 使用 DeepSeek-V4.1-Flash-1017。按 token 计费并区分高峰与空闲时段，适合用量少、波动大或需要接入自己应用的人。",
    note: "网页搜索与抓取是独立计费接口； Coding Plan 的额度不能当成通用 API 余额使用。",
    url: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing/",
    cta: "查看 DeepSeek 官方定价",
  },
  {
    name: "硅基流动",
    badge: "一个平台切换多种模型",
    description: "适合经常比较不同模型、希望统一 API 管理的人。可用于编程工具，也可用于自己的应用，按具体模型与用量结算。",
    note: "不同模型、速度和上下文档位价格不同；先在模型中心核对，再决定充值金额。",
    url: "https://www.siliconflow.cn/models",
    cta: "查看硅基流动模型中心",
  },
];

export const modelGuideSearchText = [
  "国产模型选型指南 含羊毛",
  "方舟 Coding Plan GLM-5.3 DeepSeek-V4.1-Flash Doubao-Seed-Evolving 邀请码 9.5折",
  "MiniMax M Plan GLM Coding Plan Kimi Code 阿里云百炼 DeepSeek API 硅基流动",
  "免费试用 包月订阅 API 按量计费 价格 优惠 邀请返利",
].join(" ").toLowerCase();
