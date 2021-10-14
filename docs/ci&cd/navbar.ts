import type { NavbarGroup } from "@vuepress/theme-default";

const nav: NavbarGroup = {
  text: "CI/CD",
  children: [
    {
      text: "Travis",
      link: "/ci&cd/travis.md",
    },
    {
      text: "Github Actions",
      link: "/ci&cd/github_action.md",
    }
  ],
};

export default nav;
