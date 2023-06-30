import useIntersectionObserver from "@react-hook/intersection-observer";
import { useMemo, useRef } from "react";
import { youTubeUrlToEmbed } from "../utils/youtube";

interface Props {
  url?: string;
  title?: string;
}

const LazyYoutubeFrame = ({ url, title }: Props) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const lockRef = useRef(false);

  const { isIntersecting } = useIntersectionObserver(containerRef);

  if (isIntersecting && !lockRef.current) {
    lockRef.current = true;
  }

  const videoUrl = useMemo(() => {
    if (!url) {
      return;
    }

    return youTubeUrlToEmbed(url);
  }, [url]);

  return (
    <div
      ref={(ref) => {
        if (ref) {
          containerRef.current = ref;
        }
      }}
    >
      {lockRef.current && (
        <iframe
          title={title}
          src={videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          width="100%"
          height="315"
        ></iframe>
      )}
    </div>
  );
};

export default LazyYoutubeFrame;
