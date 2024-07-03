import { CodePageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useEffect, useRef } from "react";

export interface CodeSectionProps {
  section: CodePageSection;
}

export default function CodeSection({ section }: CodeSectionProps) {
  const { js, css, html } = section.config;

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = "";

      const range = document.createRange();
      const rangeCss = document.createRange();
      const rangeJs = document.createRange();

      const cssFrag = rangeCss.createContextualFragment(
        `<style>${css}</style>`
      );
      const htmlFrag = range.createContextualFragment(html);
      const jsFrag = rangeJs.createContextualFragment(`<script>${js}</script>`);

      divRef.current.appendChild(cssFrag);
      divRef.current.appendChild(htmlFrag);
      divRef.current.appendChild(jsFrag);
    }
  }, [divRef.current, html, css, js]);

  return <div ref={divRef}></div>;
}
