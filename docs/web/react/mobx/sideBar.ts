import { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "Mobx",
    children: [
      "/web/react/mobx/README.md",
      "/web/react/mobx/安装和配置.md",
      "/web/react/mobx/mobx初探.md",
      "/web/react/mobx/异步action.md",
      "/web/react/mobx/数据监听并响应.md",
    ],
  },
];

export default sideBar;
