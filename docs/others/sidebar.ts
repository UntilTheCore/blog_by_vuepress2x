import type { SidebarConfigArray } from '@vuepress/theme-default';

const sideBar: SidebarConfigArray = [
  {
    'text': 'Others',
    "link": '/others/',
    'children': [
      '/others/vscode.md',
      '/others/alias.md',
    ]
  },
]

export default sideBar;