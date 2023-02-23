import Script from 'next/script';
import parse from 'html-react-parser';

const parser = (input: string) =>
  parse(input, {
    replace: (domNode) => {
      if (domNode.type === 'script') {
        //@ts-ignore
        return <Script src={domNode.attribs.src || ''} />;
      }
    },
  });

export function Widget({ htmlString }: { htmlString: string }) {
  return <>{parser(htmlString)}</>;
}
