import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "Crystal UI",
    children: [
      "/project/crystal-ui/README.md",
      "/project/crystal-ui/install.md",
      "/project/crystal-ui/attention.md",
      "/web/vue/vue3/provide-inject.md",
      "/project/crystal-ui/type-of-checking.md",
      "/project/crystal-ui/support-markdown.md",
      "/project/crystal-ui/source-code-extractor.md",
      "/project/crystal-ui/support-code-highlighting.md",
      "/project/crystal-ui/deploy.md",
      "/project/crystal-ui/QA.md",
    ],
  },
];

export default sideBar;
