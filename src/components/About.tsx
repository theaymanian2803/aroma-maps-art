import { Coffee, Leaf, Heart } from 'lucide-react';

const values = [
  {
    icon: Coffee,
    title: 'Quality First',
    description: 'We source only the top 1% of specialty-grade beans from trusted farmers worldwide.',
  },
  {
    icon: Leaf,
    title: 'Sustainably Sourced',
    description: 'Direct trade relationships ensure fair wages and environmentally conscious practices.',
  },
  {
    icon: Heart,
    title: 'Roasted with Love',
    description: 'Small-batch roasting in our local facility to ensure peak freshness in every cup.',
  },
];

const About = () => {
  return (
    <section id="about" className="section-padding bg-cream">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80"
                alt="Coffee being poured"
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-card"
              />
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&q=80"
                alt="Coffee beans"
                className="w-full aspect-square object-cover rounded-lg shadow-card"
              />
            </div>
            <div className="pt-8">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80"
                alt="Barista at work"
                className="w-full aspect-[4/5] object-cover rounded-lg shadow-card"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-terracotta font-medium tracking-widest uppercase text-sm mb-4">
              Our Story
            </span>
            <h2 className="heading-section text-foreground mb-6">
              A Passion for Perfect Coffee
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              Founded in 2015, Brew & Co. began with a simple mission: to bring 
              exceptional coffee to our community. What started as a small cart 
              at the local farmers market has grown into a beloved neighborhood 
              roastery and café.
            </p>
            <p className="text-body text-muted-foreground mb-10">
              We travel to origin countries, building relationships with farmers 
              who share our commitment to quality and sustainability. Every bag 
              of coffee tells a story—from the farm to your cup.
            </p>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
