import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 text-text-secondary mx-auto mb-4">{icon}</div>
        <h3 className="text-text-secondary text-lg mb-4 font-medium">
          {title}
        </h3>
        <p className="text-text-secondary mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
