# PostCSS TransOre

PostCSS TransOreは、CSSファイル内で、pxをremやemに変換したり、clamp関数を計算したりするのに便利なプラグインです。

## インストール

```zsh
npm i @hilosiva/postcss-transore -D
```

postcss.config.js などの設定ファイルに読み込み


```javascript
module.exports = {
  plugins: [
    require("@hilosiva/postcss-transore"),
  ],
};
```

## 利用できる関数

### `pxtorem(px: number)`

pxからremに変換する関数、引数にはpxの値（number）を指定します。


```css
h2 {
  font-size: pxtorem(24);
}
```

↓

```css
h2 {
  font-size: 1.5rem;
}
```

### `pxtoem(px: number, base?: number)`

pxからemに変換する関数、引数には変換するpxの値（number）と、ベースとなるpxの値（number）[default: 16]を指定します。

```css
h2 {
  font-size: pxtoem(24);
  margin-top: pxtoem(24, 24);
}
```

↓

```css
h2 {
  font-size: 1.5em;
  margin-top: 1em;
}
```


### `fluid(minSize: number, maxSize: number, minViewPort?: number, maxViewPort?: number)`

最小値のpx（number）と最大値のpx（number）から推奨値を計算し `clamp()` を返す関数です。
minViewPort[default: 375]や、maxViewPort[default: 1920]を指定することで可変するビューポートを指定可能です。


```css
h2 {
  font-size: fluid(16, 24);
}
```

↓

```css
h2 {
  font-size: clamp(1rem, 0.8786407766990291rem + 0.517799352750809vw, 1.5rem);
}
```


## オプション

### minViewPort

`fluid()`の最小ビューポートのデフォルト値を変更できます。（default: 320）

```javascript
module.exports = {
  plugins: [
    require("@hilosiva/postcss-transore", {
      minViewPort: 320
    }),
  ],
};
```



### maxViewPort

`fluid()`の最大ビューポートのデフォルト値を変更できます。（default: 1920）

```javascript
module.exports = {
  plugins: [
    require("@hilosiva/postcss-transore", {
      maxViewPort: 1440
    }),
  ],
};
```
