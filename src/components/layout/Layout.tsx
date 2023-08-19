import React, { FC } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div id="container">
      <h1>Bloco</h1>
      {children}
    </div>
  );
};
