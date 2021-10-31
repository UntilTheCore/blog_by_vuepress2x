import { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "Vue3",
    children: [
      "/web/vue/vue3/README.md",
      "/web/vue/vue3/knowledge-points.md",
      "/web/vue/vue3/provide-inject.md",
      "/web/vue/vue3/vue3-v-model.md",
      "/web/vue/vue3/$attrs.md",
    ],
  },
];

export default sideBar;
