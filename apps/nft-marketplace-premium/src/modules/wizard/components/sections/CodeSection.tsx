import { useEffect } from 'react';
import { CodePageSection } from '../../types/section';

export interface CodeSectionProps {
  section: CodePageSection;
}

export default function CodeSection({ section }: CodeSectionProps) {
  const { js, css, html } = section.config;

  useEffect(() => {
    const script = document.createElement('script');

    script.innerHTML = js;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [js]);

  return (
    <>
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
