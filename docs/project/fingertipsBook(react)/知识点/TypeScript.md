# TypeScript

## 从对象中获取类型

```ts
const categoryMap = {'+': '收入', '-': '支出'};
type categoryType = keyof typeof categoryMap;

/* 获取过程分解:
* typeof categoryMap => {'+': string, '-': string}; 
* keyof typeof categoryMap => {'+' | '-'};
*/

```
