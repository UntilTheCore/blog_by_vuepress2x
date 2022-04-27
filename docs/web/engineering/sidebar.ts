import type { SidebarConfigArray } from "@vuepress/theme-default";

const sideBar: SidebarConfigArray = [
  {
    text: "工程化",
    children: [
      "/web/engineering/", 
      "/web/engineering/module_specification.md",
      {
        text: "ESlint",
        link: "/web/engineering/eslint/",
        children: [
          "/web/engineering/eslint/user_guide.md",
          "/web/engineering/eslint/eslint_advanced.md",
        ]
      }
    ],
  },
];

export default sideBar;
