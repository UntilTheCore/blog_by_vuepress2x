import type { SidebarConfigArray } from '@vuepress/theme-default';

const sideBar: SidebarConfigArray = [
  {
    'text': 'fingertipsBook(react)',
    'children': [
      '/project/fingertipsBook(react)/README.md',
      '/project/fingertipsBook(react)/初始化.md',
      {
        text: '知识点',
        children: [
          '/project/fingertipsBook(react)/知识点/JavaScript.md',
          '/project/fingertipsBook(react)/知识点/TypeScript.md',
          '/project/fingertipsBook(react)/知识点/ReactRouter.md',
          '/project/fingertipsBook(react)/知识点/TreeShaking.md',
          '/project/fingertipsBook(react)/知识点/SVG.md',
          '/project/fingertipsBook(react)/知识点/受控组件和非受控组件.md',
        ]
      }
    ]
  },
]

export default sideBar;