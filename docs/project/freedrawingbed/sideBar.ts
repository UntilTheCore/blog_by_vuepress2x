import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "FreeDrawingBed(react)",
    children: [
      "/project/freedrawingbed/README.md",
      "/project/freedrawingbed/初始化.md",
      {
        text: "知识点",
        children: [
          "/web/react/react/组件懒加载.md",
          "/server/serverless/leancloud/图片上传.md",
        ],
      },
    ],
  },
];

export default sideBar;
