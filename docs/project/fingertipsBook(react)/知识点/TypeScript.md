# React & TypeScript

## 控制台出现两次log

项目运行时，改变state想通过`console.log`看看数据是否正确但发现打印了两次（组件渲染了两次）。这是React有意为之的，目的是期望能帮助开发者发现可能的bug！致使出现这个情况的原因是在代码中开启了[严格模式](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)，而且通过`cra`创建的项目是在`<App />`根节点上开启的，等于自己所有的代码会被应用严格模式。

注：严格模式(Strict Mode)只会在开发环境下生效！

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

## 获取去除类型某个成员后的类型

当可能的两个类型十分相似，b类型比a类型只少一两个类型成员时，不需要再额外对b写一遍。使用ts提供的`Omit`类型工具即可帮助我们去除a类型中的部分不需要的类型：

```tsx
type recordType = {
  tags: number[],
  note: string,
  category: "+" | "-",
  money: number,
  createAt: string,
}

// 去除 createAt
type newRecordType = Omit<recordType, "createAt">;
```

得到新类型

```tsx
type newRecordType = {
  tags: number[],
  note: string,
  category: "+" | "-",
  money: number,
}
```

如果希望移除更多类型，可将第二个参数用`|`分隔需要移除的类型成员名：

```tsx
type newRecordType = Omit<recordType, "money" | "money">;
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

## props设置默认值

封装的组件我们想给它一个默认的行为，那就需要给`props`设置一个默认值，比如一个`<TopBar />`组件，它左上角的返回按钮应该是默认拥有返回按钮的。通过设置组件的`defaultProps`对象即可控制其相关默认行为：

```tsx {21-23}
// <TopBar />非完成代码
type Props = {
  /** topbar的名称 */
  title: string,
  /** 是否启用返回按钮 */
  back?: boolean,
}

const TopBar: React.FC<Props> = (props) => {
  return (
    <div>
      {
        props.back && <Icon name="left" />
      }
      <span>{props.title}</span>
    </div>
  );
}

// 设置组件的默认props
TopBar.defaultProps = {
  back: true,
}

export default TopBar;
```

## props类型增强

当我们需要封装(增强)出一个原生HTML元素时，相应的，也需要对新组件的Props进行扩充。比如对一个`<input />`元素进行封装，在左侧给它增加一个`lable`，内容由外部通过`props`提供。此时会定义Props的类型：

```tsx
type Props = {
  labelName: string
}
```

但这样原生`input`的属性怎么办？那么多总不可能一个个自己写吧？这个时候ts的类型增强就非常好地帮我们解决这个问题，操作符是`&`。它可以将多个类型合并为到一个类型中，官方称为[交叉类型](https://www.tslang.cn/docs/handbook/advanced-types.html)

```tsx
// 将input的属性合并到Props中
type Props = {
  title: string,
} & React.InputHTMLAttributes<HTMLInputElement>;
```

经过增加后的props，需要先将自己所需的属性单独提取出来，然后用ES6提供的析构语法和[扩展运算符](https://es6.ruanyifeng.com/#docs/object#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)`...`将剩余属性放入`input`中，这样就能大大减少对`input`属性编写了！

```tsx {8,14}
// 增强<Input />组件，非完成代码
type Props = {
  title: string,
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  // 将自己会用到属性单独提取出来,剩余的放入rest
  const { title, children, ...rest } = props;
  return (
    <InputWrapper>
      <label>
        <span>{props.title}</span>
        {/* 将剩余参数展开 */}
        <input type="text" {...rest} />
      </label>
    </InputWrapper>
  );
};

export default Input;
```

## 类名合并

在vue中，通过`v-bind`绑定的`class`可以和默认的`class`自动实现合并。但在React中，没有这样的操作，我们可以自己手动通过外部是否传入了`className`来判断是否需要进行`className`的合并:

```tsx
// 非完成代码
const myComponent = (props) => {
  return (
    <div className={'name1' + props.className ? props.className : ''} >Hi</div>
  );
}
```

如果要添加多个类名怎么办？这看起来有点不太友好！此时可以使用[classnames](https://www.npmjs.com/package/classnames)来帮助实现类名合并：

:::tip
新的classnames已支持类型提示，如果在引入时发现IDE提示有错误，可以安装一下`@types/classnames`增强类型提示能力。
:::

```tsx
import cs from 'classnames';
// 非完成代码
const myComponent = (props) => {
  return (
    <div className={cs('name1','name2')} >Hi</div>
  );
}
```

`classnames`也支持类似vue对象等方式判断处理类名，可访问[classnames的npm](https://www.npmjs.com/package/classnames)看更多使用示例。
