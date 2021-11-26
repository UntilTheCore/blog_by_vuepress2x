import type { NavbarConfig } from "@vuepress/theme-default";
import WebNav from "../web/navbar";
import CNav from "../c/navbar";
import ProjectNav from "../project/navbar";
import othersNav from "../others/navbar";
import serverNav from "../server/navbar";
import cicdNav from "../ci&cd/navbar";

const nav: NavbarConfig = [
  WebNav,
  serverNav,
  cicdNav,
  CNav,
  ProjectNav,
  othersNav,
];

export default nav;
