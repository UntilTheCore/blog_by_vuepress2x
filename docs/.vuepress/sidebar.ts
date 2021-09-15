import type { SidebarConfig } from "@vuepress/theme-default";
import projectSideBar from "../project/fingertipsBook(react)/sideBar";
import vuepressSideBar from "../web/vue/vuepress/sideBar";
import vue2SideBar from "../web/vue/vue2/sideBar";
import vue3SideBar from "../web/vue/vue3/sideBar";
import mobxSideBar from "../web/react/mobx/sideBar";
import reduxSideBar from "../web/react/redux/sideBar";
import cSideBar from "../c/c/sideBar";
import cplusSideBar from "../c/cplus/sideBar";
import homeSideBar from "../home/sideBar";
import ideSideBar from "../ide/sidebar";
import freeDrawingBedSideBar from "../project/freedrawingbed/sideBar";
import reactSideBar from "../web/react/react/sideBar";

const sideBar: SidebarConfig = {
  "/project/fingertipsBook(react)/": projectSideBar,
  "/project/freedrawingbed/": freeDrawingBedSideBar,
  "/web/vue/vuepress/": vuepressSideBar,
  "/web/vue/vue2/": vue2SideBar,
  "/web/vue/vue3/": vue3SideBar,
  "/web/react/mobx/": mobxSideBar,
  "/web/react/redux/": reduxSideBar,
  "/c/c/": cSideBar,
  "/c/cplus/": cplusSideBar,
  "/ide/": ideSideBar,
  "/home/": homeSideBar,
  "/web/react/react/": reactSideBar,
};

export default sideBar;
