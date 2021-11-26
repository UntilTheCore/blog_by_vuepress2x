import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import navbar from "./navbar";
import sideBar from "./sidebar";

export default defineUserConfig<DefaultThemeOptions>({
  lang: "zh-CN",
  title: "untilthecore's blog",
  description: "欢迎访问 untilthecore 的个人博客",
  head: [
    ["link", { rel: "icon", href: "/images/favicon.ico" }],
    ["script", { type: "text/javascript", src: "/js/baidu_statistics.js" }],
    [
      "script",
      {
        type: "text/javascript",
        src: "https://v1.cnzz.com/z_stat.php?id=1280635059&web_id=1280635059",
      },
    ],
  ],

  themeConfig: {
    navbar,
    sidebar: sideBar,
    lastUpdatedText: "最近更新",
    backToHome: "返回首页",
    tip: "提示",
    warning: "注意",
    danger: "警告",
  },
});
