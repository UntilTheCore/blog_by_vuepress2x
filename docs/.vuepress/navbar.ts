import type { NavbarConfig } from "@vuepress/theme-default";
import WebNav from "../web/navbar";
import CNav from "../c/navbar";
import ProjectNav from "../project/navbar";
import ideNav from "../ide/navbar";
import serverNav from "../server/navbar";

const nav: NavbarConfig = [WebNav, serverNav, CNav, ProjectNav, ideNav];

export default nav;
