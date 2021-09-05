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

## 自定义Hook返回值该使用什么类型

前提：typescript**自动推测**自定义Hook返回值类型。

结论：在ts+React自定义Hook内的返回值数量大于1时最好使用对象类型。

按照`useState`中析构出来值组合成数组返回不可以吗？当然是可以的，但别忘了上面说的前提条件，让ts自动推测！为了减少不必要的类型书写，我们可以多利用ts的自动类型推测。使用数组方式返回不是不可以，为了保证类型的正确性，我们需要自己手写返回类型：

```tsx {5}
import { useState } from "react";
import React from "react";

// 手动返回值类型编写。这种在写在中括号内的像数组一样但按位置存不同类型的类型，称为元组
const useTags = (): [string[], React.Dispatch<React.SetStateAction<string[]>>] => {
  const [tags, setTags] = useState<string[]>(["衣", "食", "住", "行"]);
  return [tags, setTags];
};

export { useTags };
```

为了让返回值类型达到预期，需要额外写这么多的类型代码，有些得不偿失。但让ts自己推测呢？它会推测为这样的类型，一个可选类型的数组：

```tsx
type t = (string[] | React.Dispatch<React.SetStateAction<string[]>>)[];
```

这样在外部析构`tags`时，ts会提示`tags`可能不是一个可迭代的类型值。很明显，自动推测“失误”了，但它却并没错，以适应更大宽容度的类型来说，`[tags,setTags]`确实是一个可选类型的数组。而我们需要的是一个只含有`string[]`和`React.Dispatch<React.SetStateAction<string[]>>`类型的数组！

我们的目的是既让ts能正确推测类型，又不用自己手动编写返回值类型！为了达到这样的目的，即将值使用对象包裹后返回！这样ts就知道对象中有哪些数据和哪些类型了。

```tsx {6-11}
import { useState } from "react";
import React from "react";

const useTags = () => {
  const [tags, setTags] = useState<string[]>(["衣", "食", "住", "行"]);
  /* 返回值类型将被自动推测为： 
     {
        tags: string[], 
        setTags: React.Dispatch<React.SetStateAction<string[]>>
     } 
  */
  return {tags, setTags};
};

export { useTags };
```
