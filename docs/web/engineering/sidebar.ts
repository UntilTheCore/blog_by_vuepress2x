import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "工程化",
    children: ["/web/engineering/", "/web/engineering/module_specification.md"],
  },
];

export default sideBar;
