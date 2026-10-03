import type { DictionaryArea } from "../types";

// Approved by the client without a separate language review (2026-10-03).
const sim: DictionaryArea<"sim"> = {
    meta: {
        title: "马来西亚旅游电话卡套餐",
        description: "在线预订旅游电话卡，抵达 KLIA 2 后即可领取。按供应商和使用期限比较套餐。",
    },
    breadcrumb: "马来西亚旅游电话卡",
    duration: {
        format: "{n} {unit}",
        days: "天",
        hours: "小时",
    },
    freeBadge: "（免费）",
    list: {
        title: "马来西亚旅游电话卡套餐",
        features: {
            noId: {
                title: "无需证件",
                body: "注册快捷简单。只需用电子邮箱注册即可开始。",
            },
            collection: {
                title: "KLIA 2 领取",
                body: "随时预订，抵达 KLIA 2 机场后即可领取电话卡。",
            },
            data: {
                title: "5G 无限流量",
                body: "在马来西亚各地出行，享受全国高速网络覆盖。",
            },
        },
        pickTitle: "选择适合您行程的旅游套餐！",
        pickBody: "按供应商和停留天数比较数据套餐，选择适合您行程的一款。",
        provider: "供应商",
        allProviders: "全部供应商",
        duration: "使用期限",
        allDurations: "全部期限",
        viewDetails: "查看详情",
        noMatch: "没有符合筛选条件的旅游电话卡套餐。",
        clearFilters: "清除所有筛选",
        faq: {
            title: "常见问题",
            where: {
                q: "这张旅游电话卡可以在哪里使用？",
                a: "Teeko Travel SIM 目前仅限在马来西亚境内使用。",
            },
            signUp: {
                q: "如何注册旅游电话卡？",
                a: "无需证件。您可以随时预订，只需用电子邮箱注册即可。",
            },
            packages: {
                q: "有哪些旅游电话卡套餐？",
                a: "我们提供从 12 小时到 7 天不等的多种套餐，满足您的出行需要。",
            },
            eligible: {
                q: "谁可以在线预订旅游电话卡？",
                a: "用户须年满 18 岁方可注册。16 至 18 岁的用户可在父母或法定监护人的监督下使用本服务。",
            },
            redeem: {
                q: "如何领取我的旅游电话卡？",
                a: "预订确认后，您会收到一封电子邮件和一个验证码。抵达 KLIA 2 机场后，向我们的工作人员出示预订验证码即可领取电话卡。",
            },
            cancel: {
                q: "我可以取消旅游电话卡预订吗？",
                a: "可以，您可以在个人资料页面的“我的旅游电话卡预订”部分取消预订。",
            },
        },
    },
    detail: {
        notFoundTitle: "未找到该套餐",
        metaFallbackDescription: "了解更多关于 {name} 的信息",
        badge: "旅游电话卡",
        coreFeatures: "产品主要特点",
        paymentMethods: "支持多种付款方式",
        fallbackPayments: {
            local: {
                title: "本地电子支付方式",
                alt: "本地支付",
                body: "支持马来西亚主要电子钱包，例如 DuitNow、ShopeePay、Touch 'n Go eWallet、Grabpay 和 Boost。",
            },
            international: {
                title: "国际支付方式",
                alt: "国际支付",
                body: "支持信用卡/借记卡（Visa/MasterCard）、FPX 网上银行，以及支付宝（Alipay）和微信支付（WeChat Pay）等常用国际支付渠道。",
            },
            automated: {
                title: "自动化处理流程",
                alt: "自动化",
                body: "款项实时到账，系统自动完成电话卡激活和佣金结算，提高效率和透明度。",
            },
        },
        otherPackages: "其他套餐",
        moreFromProvider: "查看 {provider} 的更多选择",
        viewAll: "查看全部电话卡 →",
    },
};

export default sim;
