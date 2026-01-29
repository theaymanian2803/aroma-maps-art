import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const Location = () => {
  return (
    <section id="location" className="section-padding bg-background">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-terracotta font-medium tracking-widest uppercase text-sm mb-4">
            Find Us
          </span>
          <h2 className="heading-section text-foreground mb-4">
            Visit Our Café
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Stop by our cozy café and roastery to experience our coffee firsthand. 
            We'd love to share a cup with you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-warm h-[400px] lg:h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707167458!2d-73.98784492397698!3d40.75797623540898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1703123456789!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Brew & Co. Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    Address
                  </h3>
                  <p className="text-muted-foreground">
                    123 Coffee Lane<br />
                    Downtown District<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    Hours
                  </h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 7am - 7pm<br />
                    Saturday: 8am - 6pm<br />
                    Sunday: 9am - 5pm
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    Phone
                  </h3>
                  <a href="tel:+12125551234" className="text-muted-foreground hover:text-terracotta transition-colors">
                    (212) 555-1234
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    Email
                  </h3>
                  <a href="mailto:hello@brewandco.com" className="text-muted-foreground hover:text-terracotta transition-colors">
                    hello@brewandco.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 p-6 bg-primary rounded-lg">
              <h3 className="font-serif text-xl font-semibold text-primary-foreground mb-2">
                Order Ahead
              </h3>
              <p className="text-primary-foreground/80 mb-4">
                Skip the line! Order your favorite coffee online and pick it up at our café.
              </p>
              <a href="#" className="inline-flex bg-terracotta text-cream px-6 py-3 rounded-sm font-medium hover:bg-terracotta/90 transition-colors">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
