import React from "react";
import "./centered-card-layout.css";

interface CenteredCardLayoutProps {
  children: React.ReactNode;
}

export const CenteredCardLayout: React.FC<CenteredCardLayoutProps> = ({
  children,
}) => {
  return <div className="centered-card-layout">{children}</div>;
};
