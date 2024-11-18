import { CodePageSection } from "@dexkit/ui/modules/wizard/types/section";
import { Widget } from "../Widget";

export interface CodeSectionProps {
  section: CodePageSection;
}

export default function CodeSection({ section }: CodeSectionProps) {
  const { js, css, html } = section.config;

  /* useEffect(() => {
    const script = document.createElement('script');

    script.innerHTML = js;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [js]);*/

  return (
    <>
      {css && <Widget htmlString={`<style>${css}</style>`} />}
      {js && <Widget htmlString={`<script>${js}<script>`} />}
      {html && <Widget htmlString={html} />}
    </>
  );
}
