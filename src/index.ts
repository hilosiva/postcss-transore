import { PluginCreator } from "postcss";

interface PluginOptions {
  // オプションの型を定義
  minViewPort?: number;
  maxViewPort?: number;
  [key: string]: any;
}

const getRem = (px: number) => {
  return `${px / 16}rem`;
};
const getEm = (px: number, base: number = 16) => {
  return `${px / base}em`;
};

// Clampを計算する関数
const getFluid = (minSize: number, maxSize: number, minViewPort: number = 375, maxViewPort: number = 1920) => {
  const valiablePart = (maxSize - minSize) / (maxViewPort - minViewPort);
  const constant = maxSize - maxViewPort * valiablePart;

  return `clamp(${getRem(minSize)}, ${getRem(constant)} + ${100 * valiablePart}vw, ${getRem(maxSize)})`;
};

const plugin: PluginCreator<PluginOptions> = (opts = {}) => {
  return {
    postcssPlugin: "transore",
    Once(root: any, { result }: any) {
      try {
        // 既存のCSSファイルに含むオリジナル関数の処理
        root.walkDecls((decl: any) => {
          // fluid関数
          let fluidMatch;
          while ((fluidMatch = /fluid\(([^)]+)\)/.exec(decl.value)) !== null) {
            const [minSize, maxSize, minViewPort, maxViewPort] = fluidMatch[1]
              .replace(/\s/g, "")
              .split(",")
              .map((value) => {
                if (value === "") {
                  return undefined; // 空文字列があれば undefined とする
                }
                const numericValue = parseFloat(value);
                if (isNaN(numericValue)) {
                  throw new Error(`Invalid argument '${value}' in fluid() function.`);
                }
                return numericValue;
              }); // () の中の文字列
            if (!minSize || !maxSize) {
              throw new Error(`fluid() には最低2つの引数が必要です`);
            }
            decl.value = decl.value.replace(fluidMatch[0], getFluid(minSize, maxSize, minViewPort || opts.minViewPort || 375, maxViewPort || opts.maxViewPort || 1920));
          }
          // pxtorem関数
          let remMatch;
          while ((remMatch = /pxtorem\(([^)]+)\)/.exec(decl.value)) !== null) {
            const px = parseFloat(remMatch[1]);
            if (isNaN(px)) {
              throw new Error(`Invalid argument '${remMatch[1]}' in rem() function.`);
            }
            decl.value = decl.value.replace(remMatch[0], getRem(px));
          }
          // pxtoem関数
          let emMatch;
          while ((emMatch = /pxtoem\(([^)]+)\)/.exec(decl.value)) !== null) {
            const [px, basePx] = emMatch[1]
              .replace(/\s/g, "")
              .split(",")
              .map((value) => {
                if (value === "") {
                  return undefined; // 空文字列があれば undefined とする
                }
                const numericValue = parseFloat(value);
                if (isNaN(numericValue)) {
                  throw new Error(`Invalid argument '${value}' in em() function.`);
                }
                return numericValue;
              }); // () の中の文字列;
            if (!px) {
              throw new Error(`em() には最低1つの引数が必要です`);
            }
            decl.value = decl.value.replace(emMatch[0], getEm(px, basePx ? basePx : 16));
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
