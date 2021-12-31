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
import othersSideBar from "../others/sidebar";
import freeDrawingBedSideBar from "../project/freedrawingbed/sideBar";
import reactSideBar from "../web/react/react/sideBar";
import antdSideBar from "../web/react/antd/sideBar";
import leancloudSideBar from "../server/serverless/leancloud/siebar";
import nginxSideBar from "../server/nginx/sidebar";
import cicdSideBar from "../ci&cd/sidebar";
import crystalUiSideBar from "../project/crystal-ui/sideBar";
import engineeringSideBar from "../web/engineering/sidebar";
import packageManagerSideBar from "../web/packagemanager/sidebar";

const webSideBar: SidebarConfig = {
  "/web/engineering/": engineeringSideBar,
  "/web/packagemanager/": packageManagerSideBar,
  "/web/vue/vuepress/": vuepressSideBar,
  "/web/vue/vue2/": vue2SideBar,
  "/web/vue/vue3/": vue3SideBar,
  "/web/react/mobx/": mobxSideBar,
  "/web/react/redux/": reduxSideBar,
  "/web/react/react/": reactSideBar,
  "/web/react/antd/": antdSideBar,
};

const _cSideBar: SidebarConfig = {
  "/c/c/": cSideBar,
  "/c/cplus/": cplusSideBar,
};

const serverSideBar: SidebarConfig = {
  "/server/serverless/leancloud/": leancloudSideBar,
  "/server/nginx/": nginxSideBar,
};

const _projectSideBar: SidebarConfig = {
  "/project/crystal-ui/": crystalUiSideBar,
  "/project/fingertipsBook(react)/": projectSideBar,
  "/project/freedrawingbed/": freeDrawingBedSideBar,
};

const sideBar: SidebarConfig = {
  "/home/": homeSideBar,
  "/others/": othersSideBar,
  ...webSideBar,
  ..._cSideBar,
  ...serverSideBar,
  ..._projectSideBar,
  "/ci&cd/": cicdSideBar,
};

export default sideBar;
