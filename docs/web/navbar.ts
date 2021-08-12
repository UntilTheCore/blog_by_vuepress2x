import type {NavbarGroup} from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "前端",
  children: [
    {
      text: "Vue",
      children: [
        {
          text: "Vue2",
          link: "/web/vue/vue2"
        },
        {
          text: "Vue3",
          link: "/web/vue/vue3"
        },
        {
          text: "Vuepress2x",
          link: "/web/vue/vuepress2x"
        },
      ]
    },
    {
      text: "React",
      children: [
        {
          text: "antd",
          link: "/web/react"
        },
        {
          text: "dva",
          link: "/web/react"
        },
      ]
    },
  ]
};

export default nav;
