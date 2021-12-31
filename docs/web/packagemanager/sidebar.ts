import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "包管理器",
    children: ["/web/packagemanager/", "/web/packagemanager/using_pnpm.md" ],
  },
];

export default sideBar;
