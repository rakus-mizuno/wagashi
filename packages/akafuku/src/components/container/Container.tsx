import { type FC, type PropsWithChildren } from 'react';

export const Container: FC<PropsWithChildren> = ({ children }) => {
  // breakpointがそもそも要らなかった
  return <div className="w-full">{children}</div>;
};
