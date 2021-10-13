import type { SidebarConfigArray } from '@vuepress/theme-default';

const sideBar: SidebarConfigArray = [
  {
    'text': 'Nginx',
    'children': [
      '/server/nginx/README.md',
      '/server/nginx/nginx补充安装.md',
    ]
  },
]

export default sideBar;