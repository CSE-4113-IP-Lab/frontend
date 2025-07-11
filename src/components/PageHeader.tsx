import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-text-secondary leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {children && <div className="mt-4 lg:mt-0 lg:ml-6">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
