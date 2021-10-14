import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "CI/CD",
    children: [
      "/ci&cd/README.md",
      "/ci&cd/travis.md",
      "/ci&cd/github_action.md",
    ],
  },
];

export default sideBar;
