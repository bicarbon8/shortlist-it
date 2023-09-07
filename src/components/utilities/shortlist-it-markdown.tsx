import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from 'remark-gfm';

/**
 * processes the supplied `children` string into HTML using `ReactMarkdown` with a plugin
 * of `remark-gfm` to support a wide selection of markdown formatting including tables,
 * strikethrough, horizontal lines, lists, tasks, etc.
 * @param props an object accepting a property of `children` of type `string` containing
 * the markdown text to parse into HTML
 * @returns HTML generated from parsing the passed in markdown
 */
export function ShortlistItMarkdown(props: { children: string }) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.children}</ReactMarkdown>
}