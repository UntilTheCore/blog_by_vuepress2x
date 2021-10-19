import type { NavbarGroup } from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "个人项目",
  children: [
    {
      text: "指尖账本(React)",
      link: "/project/fingertipsBook(react)/",
    },
    {
      text: "自由图床(React)",
      link: "/project/freedrawingbed/",
    },
    {
      text: "水晶UI(Vue3)",
      link: "/project/crystal-ui/",
    },
  ],
};

export default nav;
