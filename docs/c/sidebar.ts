import type {SidebarConfigArray} from "@vuepress/theme-default";

const sidebar: SidebarConfigArray = [
  {
    text: "c",
    children: [
      {
        text: "c的开始",
        link: "/c/c/firstc"
      }
    ]
  },
  {
    text: "c++",
    children: [
      {
        text: "c++的开始",
        link: "/c/cplus/firstcplus"
      }
    ]
  }
];

export default sidebar;
