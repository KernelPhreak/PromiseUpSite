export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
        <h1 className="font-outfit font-bold text-2xl text-foreground mb-2">Access not configured</h1>
        <p className="font-inter text-muted-foreground">Create a Supabase Auth user and add their email to VITE_ADMIN_EMAILS.</p>
      </div>
    </div>
  );
}
