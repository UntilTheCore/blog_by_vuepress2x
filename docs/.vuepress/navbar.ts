import type {NavbarConfig} from "@vuepress/theme-default";
import WebNav from '../web/navbar';
import CNav from '../c/navbar';
import ProjectNav from '../project/navbar';

const nav: NavbarConfig = [
  WebNav,
  CNav,
  ProjectNav,
];

export default nav;
