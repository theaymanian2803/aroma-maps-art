import { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#products', label: 'Our Coffee' },
    { href: '#about', label: 'About' },
    { href: '#location', label: 'Visit Us' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-max px-6 md:px-12">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="font-serif text-2xl font-semibold text-foreground">
            Brew & Co.
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-cream text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <a
              href="#products"
              className="hidden md:inline-flex btn-primary text-sm py-3 px-6"
            >
              Order Now
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#products"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex btn-primary text-sm py-3 px-6 mt-2"
                >
                  Order Now
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
