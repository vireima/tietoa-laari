export default {
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join("\n"),
  },
  entry: ["src/main.tsx"],
  project: ["**/*.{js,ts,tsx,css}"],
};
