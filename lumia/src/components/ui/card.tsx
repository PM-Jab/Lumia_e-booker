import React, { ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };
