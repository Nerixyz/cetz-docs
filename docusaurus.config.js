// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import fs from 'node:fs/promises';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeShiki from "@shikijs/rehype";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";
import { bundledLanguages } from "shiki";

import typstRender from "./src/remark/typst.js";

/** @type {[import('@shikijs/rehype'), import('@shikijs/rehype').RehypeShikiOptions]} */
const rehypeShikiPlugin = [
  rehypeShiki,
  {
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    addLanguageClass: true,
    langs: [
      ...Object.keys(bundledLanguages),
      // support for `typc`
      () =>
        fs
          .readFile("./src/textmate-grammars/typst-code.json", "utf-8")
          .then(JSON.parse),
    ],
    transformers: [
      // Note: when adding transformers, make sure to update src/css/shiki.css
      //       as well(they don't come with default styles)
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationFocus(),
    ],
  },
];


const config = {
  title: 'CeTZ Documentation',

  url: 'https://cetz-package.github.io/',
  baseUrl: '/docs/',

  organizationName: 'cetz-package',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ["@orama/plugin-docusaurus-v3"],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: './sidebars.js',
          beforeDefaultRemarkPlugins: [typstRender],
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex, rehypeShikiPlugin],
        },
        // blog: false,
        theme: {
          customCss: [
            './src/css/custom.css',
            './src/css/parameter.css',
            './src/css/type.css',
            './src/css/code.css',
            './src/css/shiki.css'
          ],
        },
      },
    ],
  ],

  themeConfig:
  {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CeTZ Documentation',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          label: 'Docs',
        },
      ],
    },
  },
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
