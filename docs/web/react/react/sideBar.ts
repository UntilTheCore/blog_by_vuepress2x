import { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "React",
    children: [
      "/web/react/react/README.md",
      "/web/react/react/受控组件和非受控组件.md",
      "/web/react/react/组件懒加载.md",
    ],
  },
];

export default sideBar;
