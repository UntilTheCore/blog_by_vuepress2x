import type {SidebarConfigArray} from "@vuepress/theme-default";

const sidebar: SidebarConfigArray = [
  {
    text: "Vue系列",
    children: [
      {
        text: "Vue2",
        link: '/web/vue/vue2',
        children: [
          {
            text: 'vue2基础',
            link: '/web/vue/vue2/vue2.md'
          }
        ]
      },
      {
        text: "Vue3",
        link: "/web/vue/vue3",
        children: [
          {
            text: 'vue3基础',
            link: '/web/vue/vue3/vue3.md'
          }
        ]
      },
      {
        text: "Vuepress2x",
        link: "/web/vue/vuepress2x"
      },
    ]
  },
];

export default sidebar;
