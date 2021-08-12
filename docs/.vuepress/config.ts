import {defineUserConfig} from "vuepress";
import type {DefaultThemeOptions} from "vuepress";
import sidebar from "./sidebar";
import navbar from './navbar';

export default defineUserConfig<DefaultThemeOptions>({
  lang: "zh-CN",
  title: "untilthecore's blog",
  description: "欢迎访问 untilthecore 的个人博客",

  themeConfig: {
    navbar,
    sidebar,
    lastUpdatedText: "有新内容",
    backToHome: "返回首页",
  },
});
