import { Inbox, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold text-primary">{title}</h3>
    {description && <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
