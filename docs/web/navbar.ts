import type { NavbarGroup } from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "前端",
  children: [
    {
      text: "npm & yarn",
      link: "/web/npm/",
    },
    {
      text: "工程化",
      link: "/web/engineering/",
    },
    {
      text: "Vue",
      children: [
        {
          text: "Vue2",
          link: "/web/vue/vue2/",
        },
        {
          text: "Vue3",
          link: "/web/vue/vue3/",
        },
        {
          text: "Vuepress",
          link: "/web/vue/vuepress/",
        },
      ],
    },
    {
      text: "React",
      link: "/web/react/react/",
      children: [
        {
          text: "Mobx",
          link: "/web/react/mobx/",
        },
        {
          text: "Redux",
          link: "/web/react/redux/",
        },
        {
          text: "Ant Design",
          link: "/web/react/antd/",
        },
      ],
    },
  ],
};

export default nav;
