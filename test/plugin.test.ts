import postcss from "postcss";
const plugin = require("../src/index");

async function run(input: string, output: string, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toBe(output); // toBe を使用することで、文字列の完全一致を確認します
  expect(result.warnings()).toHaveLength(0);
}

test("converts px to rem", async () => {
  await run("a{ font-size: pxtorem(16); }", "a{ font-size: 1rem; }", {});
});

test("converts px to em", async () => {
  await run("a{ font-size: pxtoem(16, 16); }", "a{ font-size: 1em; }", {});
});

test("converts fluid function", async () => {
  await run("a{ font-size: fluid(16, 24); }", "a{ font-size: clamp(1rem, 0.8571428571428572rem + 0.7142857142857143vw, 1.5rem); }", { minViewPort: 320, maxViewPort: 1440 });
});
