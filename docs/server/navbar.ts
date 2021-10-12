import type { NavbarGroup } from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "后端",
  children: [
    {
      text: 'Server',
      children: [{
        text: 'Nginx',
        link: '/server/nginx/',
      }]
    },
    {
      text: "ServerLess",
      children: [{
        text: 'LeanCloud',
        link: '/server/serverless/leancloud/'
      }],
    },
  ],
};

export default nav;
