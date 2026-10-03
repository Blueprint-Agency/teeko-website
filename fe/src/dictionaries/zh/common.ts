import type { DictionaryArea } from "../types";

// Approved by the client without a separate language review (2026-10-03).
// Simplified Chinese (client decision 2026-10-03).
const common: DictionaryArea<"common"> = {
    nav: {
        home: "首页",
        restaurants: "餐厅",
        travelSim: "旅游电话卡",
        blog: "博客",
        signIn: "登录",
        myProfile: "我的账户",
        toggleMenu: "打开或关闭菜单",
    },
    footer: {
        tagline: "带你发现马来西亚好去处的旅行指南。",
        navigation: "导航",
        resources: "资源",
        privacyPolicy: "隐私政策",
        termsOfService: "服务条款",
        privacy: "隐私",
        terms: "条款",
        rights: "© {year} Teeko。保留所有权利。",
    },
    switcher: {
        label: "语言",
    },
    notFound: {
        title: "页面不存在",
        body: "您要找的页面不存在或已移动。",
        backHome: "返回首页",
    },
    meta: {
        siteTitle: "Teeko - 探索马来西亚",
        siteDescription: "发现马来西亚的美食与旅游目的地。",
    },
    shared: {
        breadcrumb: "面包屑导航",
        home: "首页",
        previousPage: "上一页",
        nextPage: "下一页",
        close: "关闭",
        selectOption: "请选择",
    },
    maintenance: {
        loading: "加载中...",
        titleLine1: "系统",
        titleLine2: "维护中",
        body: "我们正在优化平台，很快就会恢复。",
    },
    untranslated: {
        notice: "本页面尚未完全翻译，部分内容以英文显示。",
    },
};

export default common;
