"use client";

import { useState } from "react";
import Link from "next/link";
import { Satellite, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Architecture", href: "/architecture" },
    { name: "Dataset", href: "/dataset" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity z-50">
          <Satellite className="h-6 w-6" />
          <span className="text-xl font-bold tracking-wider">InfraVision AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/Stellar-merge/IR-Colorization-Hackathon"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            GitHub
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2 z-50">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-screen h-dvh z-40 flex flex-col bg-background pt-24 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-2xl font-bold transition-colors",
                    pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://github.com/Stellar-merge/IR-Colorization-Hackathon"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-muted-foreground transition-colors hover:text-primary"
              >
                GitHub
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
