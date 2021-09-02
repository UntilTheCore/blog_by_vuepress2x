# TypeScript

## 从对象中获取键组成的类型

`typeof` 可获取对象的类型，`keyof`可将类型中的键拿出来再作为一个新的类型。

```ts
const categoryMap = {'+': '收入', '-': '支出'};
type categoryType = keyof typeof categoryMap;

/* 获取过程分解:
* typeof categoryMap => {'+': string, '-': string}; 
* keyof typeof categoryMap => {'+' | '-'};
*/

```

## 接受某个类型中的部分类型

通常情况下，使用ts设置类型基本满足需求，但有时候我们希望在类型判断的时候只匹配某个类型中的部分类型，而不是全部匹配。

typescript 提供了一个工具类型 `Partial<T>` 。经过`Partial`转化后将得到一个内部类型可选的类型。

```tsx
// 非完整代码
const fn = () => {
  const [form, setForm] = useState({
    tags: [] as string[],
    note: "",
    category: "-" as "+" | "-",
    money: 0,
  });

  const onChange = (obj: Partial<typeof form>) => {
    setForm({
      ...form,
      ...obj
    });
  };
}
```

上面的代码中，`onChange`是一个公共方法，它期望接受不同参数类型，类型需如`form`内的某个类型。于是代码中使用`typeof from`得到form的类型，然后通过`Partial`转化。参数`obj`即可实现接收其中某一类型。

```tsx
// typeof form => 
type a = {
  tags: string[],
  note: string,
  category: "-" | "+",
  money: number
}

// Partial<typeof form> =>
type b = {
  tags?: string[],
  note?: string,
  category?: "-" | "+",
  money?: number
}
```
