export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-md mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row h-auto md:h-16 items-center justify-between px-4 py-4 md:py-0 text-sm text-muted-foreground">
        <div>
          &copy; {new Date().getFullYear()} Bharatiya Antariksh Hackathon
        </div>
      </div>
    </footer>
  );
}
