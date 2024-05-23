import React from "react";
import clsx from "clsx";

import type { Props } from "@theme/MDXComponents/Code";
import CodeInline from "@theme/CodeInline";
import CopyButton from "@theme/CodeBlock/CopyButton";

import codeBlockStyles from "./Code.module.css";

function getTextForCopy(node: React.ReactNode): string {
  if (node === null) return "";

  switch (typeof node) {
    case "string":
    case "number":
      return node.toString();
    case "boolean":
      return "";
    case "object":
      if (node instanceof Array) return node.map(getTextForCopy).join("");
      if ("props" in node) {
        // skip lines that are "removed" in a diff by adding some recognizable
        // characters(\u0007) that are later removed in stripDiffSpacer().
        if (node.props.className?.includes("diff remove")) return "\u0007";
        return getTextForCopy(node.props.children);
      }
    default:
      return "";
  }
}

function stripDiff(str: string): string {
  // remove the removed lines in diffs
  return str.replace(/\u0007\n/g, "");
}

function CodeBlock(props: Props): JSX.Element {
  const code = stripDiff(getTextForCopy(props.children));

  return (
    <div className={codeBlockStyles.code}>
      <pre className={clsx(codeBlockStyles.pre, "shiki")}>
        <code {...props} />
      </pre>
      <CopyButton className={codeBlockStyles.button} code={code} />
    </div>
  );
}

// from https://github.com/facebook/docusaurus/blob/aab332c2ae3f78df5cdac6344bab0075ea07a035/packages/docusaurus-theme-classic/src/theme/MDXComponents/Code.tsx
function shouldBeInline(props: Props): boolean {
  return (
    // empty code blocks have no props.children,
    // see https://github.com/facebook/docusaurus/pull/9704
    typeof props.children !== "undefined" &&
    React.Children.toArray(props.children).every(
      (el) => typeof el === "string" && !el.includes("\n")
    )
  );
}

export default function MDXCode(props: Props): JSX.Element {
  return shouldBeInline(props) ? (
    <CodeInline {...props} />
  ) : (
    <CodeBlock {...props} />
  );
}
