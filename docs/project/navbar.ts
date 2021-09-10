import type { NavbarGroup } from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "个人项目",
  children: [
    {
      text: "指尖账本(React)",
      link: '/project/fingertipsBook(react)/'
    },
    {
      text: '自由图床(React)',
      link: '/project/freedrawingbed/'
    }
  ]
};

export default nav;
