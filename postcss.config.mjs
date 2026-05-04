const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "@csstools/postcss-cascade-layers": {
      onConditionalRulesChangingLayerOrder: "ignore",
    },
  },
};

export default config;
