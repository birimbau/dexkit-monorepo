import { Skeleton } from '@mui/material';
import useIntersectionObserver from '@react-hook/intersection-observer';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const LazyComponent = ({ children }: Props) => {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
  const { isIntersecting } = useIntersectionObserver(ref);

  return (
    <div ref={setRef}>
      {isIntersecting ? children : <Skeleton height={400}></Skeleton>}
    </div>
  );
};

export default LazyComponent;
