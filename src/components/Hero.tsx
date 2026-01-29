import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-dark/90 via-coffee-dark/70 to-coffee-dark/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-6 md:px-12 pt-20">
        <div className="max-w-2xl">
          <span className="inline-block text-terracotta font-medium tracking-widest uppercase text-sm mb-6 animate-fade-up">
            Artisan Coffee Roasters
          </span>
          
          <h1 className="heading-display text-cream mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Crafted with
            <span className="block text-terracotta">Passion & Care</span>
          </h1>
          
          <p className="text-body text-cream/80 text-lg mb-10 max-w-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
            From bean to cup, we source the finest coffee from sustainable farms 
            around the world, roasted fresh daily in our local roastery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 bg-terracotta text-cream px-8 py-4 rounded-sm font-medium transition-all duration-300 hover:bg-terracotta/90 hover:gap-3"
            >
              Explore Our Coffee
              <ArrowRight size={18} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center border-2 border-cream/30 text-cream px-8 py-4 rounded-sm font-medium transition-all duration-300 hover:bg-cream/10 hover:border-cream/50"
            >
              Our Story
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-cream/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
