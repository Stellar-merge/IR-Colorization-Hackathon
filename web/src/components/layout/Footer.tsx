export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-md mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row h-auto md:h-16 items-center justify-center px-4 py-6 md:py-0 text-sm text-muted-foreground gap-4 md:gap-0">
        <div className="transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] cursor-default text-center">
          &copy; {new Date().getFullYear()} Bharatiya Antariksh Hackathon
        </div>
      </div>
    </footer>
  );
}
