import type { DictionaryArea } from "../types";

// Approved by the client without a separate language review (2026-10-03).
const blog: DictionaryArea<"blog"> = {
    meta: {
        title: "博客 | Teeko",
        description: "旅行贴士、目的地指南和本地人的经验分享",
        postNotFound: "未找到文章",
        postFallbackDescription: "在我们的博客阅读《{title}》",
    },
    list: {
        breadcrumb: "博客",
        title: "我们的博客",
        subtitle: "旅行贴士、目的地指南和本地人的经验分享",
        readMore: "阅读更多",
        empty: "暂无已发布的文章，请稍后再来。",
        emptyTranslated: "目前还没有中文文章。我们的英文指南已经上线。",
        readEnglish: "阅读英文博客",
        loading: "正在加载最新文章...",
    },
    post: {
        travelGuide: "旅行指南",
        noContent: "暂无内容。",
        editorsPick: "编辑推荐",
        viewDetails: "查看详情并预订",
        enjoyedTitle: "喜欢这篇指南吗？",
        enjoyedBody: "在我们的旅行指南中发现更多好去处和本地人常去的地方。",
        exploreMore: "浏览更多指南",
    },
    carousel: {
        explore: "探索 {name}",
        thisArea: "此区域",
        international: "国际菜",
        priceRange: "价格区间 {range}",
        scrollLeft: "向左滚动",
        scrollRight: "向右滚动",
    },
};

export default blog;
