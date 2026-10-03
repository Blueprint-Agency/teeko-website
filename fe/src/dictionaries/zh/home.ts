import type { DictionaryArea } from "../types";

// Unreviewed first draft (2026-10-03): awaiting the client's Chinese reviewer.
const home: DictionaryArea<"home"> = {
    hero: {
        titleBefore: "与 Teeko 一起",
        titleHighlight: "轻松",
        titleAfter: "游马来西亚",
        subtitle: "美食推荐、在 KLIA2 领取的旅游电话卡，以及实用旅行指南",
        cta: "预订旅游电话卡",
        goToSlide: "前往第 {n} 张",
        stats: {
            Places: "地点",
            Reviews: "评论",
            "Avg Rating": "平均评分",
            Cities: "城市",
        },
    },
    featured: {
        title: "推荐地点",
        description: "附有 Google 和 TripAdvisor 评分的餐厅",
    },
    esim: {
        title: "旅游 SIM 卡供应商",
        description: "在线预订数据套餐，抵达后在 KLIA2 领取",
        bookNow: "立即预订",
        viewAll: "查看全部旅游 SIM 卡套餐",
        units: {
            day: "天",
            days: "天",
            week: "周",
            weeks: "周",
            month: "个月",
            months: "个月",
        },
    },
    blog: {
        title: "浏览博客",
        description: "马来西亚出行与美食指南",
        readMore: "阅读更多",
        visitBlog: "访问我们的博客",
    },
};

export default home;
