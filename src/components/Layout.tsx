import React, { ReactNode } from "react";
import NavBar from "./NavBar";
import ScrollUp from "./ScrollUp";

type Props = {
  children: ReactNode;
};

/**
 * Wrapping component for the layout of the app.
 *
 * @param children - The children component of the layout.
 */
const Layout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <NavBar />
      {children}
      <ScrollUp yOffset={1200} smoothingFactor={40} />
    </>
  );
};

export default Layout;
