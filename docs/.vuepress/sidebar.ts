import type {SidebarConfig} from '@vuepress/theme-default';
import CSideBar from '../c/sidebar';
import WebVueSideBar from '../web/vue/sidebar';
import WebReactSideBar from '../web/react/sidebar';

const s: SidebarConfig = {
  '/c': CSideBar,
  '/web/vue': WebVueSideBar,
  '/web/react': WebReactSideBar,
};

export default s;

