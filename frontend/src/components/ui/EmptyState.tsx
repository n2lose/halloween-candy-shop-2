type EmptyStateProps = { icon?: string; title: string; description?: string };

export default function EmptyState({ icon = "🕸️", title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-5xl">{icon}</span>
      <p className="font-headline text-xl text-on-surface">{title}</p>
      {description && <p className="text-sm text-secondary/60 max-w-xs">{description}</p>}
    </div>
  );
}
