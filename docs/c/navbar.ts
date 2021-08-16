import type {NavbarGroup} from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "C/C++",
  children: [
    {
      text: "C",
      link: '/c/c/'
    },
    {
      text: "C++",
      link: '/c/cplus/'
    },
  ]
};

export default nav;
