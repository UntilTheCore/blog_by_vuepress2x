import type { SidebarConfig } from '@vuepress/theme-default';
import projectSideBar from '../project/sideBar';
import vuepressSideBar from '../web/vue/vuepress/sideBar';
import vue2SideBar from '../web/vue/vue2/sideBar'
import vue3SideBar from '../web/vue/vue3/sideBar'
import reactSideBar from '../web/react/sideBar'
import cSideBar from '../c/c/sideBar'
import cplusSideBar from '../c/cplus/sideBar'
import homeSideBar from '../home/sideBar'
import ideSideBar from '../ide/sidebar'

const sideBar: SidebarConfig = {
  '/project/fingertipsBook(react)/': projectSideBar,
  '/web/vue/vuepress/': vuepressSideBar,
  '/web/vue/vue2/': vue2SideBar,
  '/web/vue/vue3/': vue3SideBar,
  '/web/react/': reactSideBar,
  '/c/c/': cSideBar,
  '/c/cplus/': cplusSideBar,
  '/ide/': ideSideBar,
  '/home/': homeSideBar,
}

export default sideBar;