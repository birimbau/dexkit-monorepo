import { CodePageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useEffect, useRef } from "react";

export interface CodeSectionProps {
  section: CodePageSection;
}

export default function CodeSection({ section }: CodeSectionProps) {
  const { js, css, html } = section.config;

  const divRef = useRef<HTMLDivElement | null>(null);

  const invalidRef = useRef(false);

  /* useEffect(() => {
    const script = document.createElement('script');

    script.innerHTML = js;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [js]);*/

  useEffect(() => {
    if (divRef.current) {
      try {
        divRef.current.innerHTML = "";

        const range = document.createRange();
        const rangeCss = document.createRange();
        const rangeJs = document.createRange();

        const cssFrag = rangeCss.createContextualFragment(
          `<style>${css}</style>`
        );
        const htmlFrag = range.createContextualFragment(html);
        const jsFrag = rangeJs.createContextualFragment(
          `<script>${js}</script>`
        );

        divRef.current.appendChild(cssFrag);
        divRef.current.appendChild(htmlFrag);
        divRef.current.appendChild(jsFrag);

        invalidRef.current = false;
      } catch (err) {
        invalidRef.current = true;
      }
    }
  }, [divRef.current, html, css, js]);

  return (
    <>
      {/* {css && <Widget htmlString={`<style>${css}</style>`} />}
      {js && <Widget htmlString={`<script>${js}<script>`} />} */}
      {!invalidRef.current && <div ref={divRef}></div>}
    </>
  );
}
