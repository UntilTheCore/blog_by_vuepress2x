import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "CI/CD",
    children: ["/ci&cd/README.md", "/ci&cd/travis.md"],
  },
];

export default sideBar;
