import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHotels } from "@/actions/allActions";
import { Hotel } from "@/types/types";

export default async function  Home() {

   const { data: hotels } = await getHotels({ limit: 3 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luxury hotel interior"
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white leading-tight">
              Experience{" "}
              <span className="font-medium">Unparalleled Luxury</span> in Every
              Stay
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Discover handpicked premium accommodations that redefine comfort
              and elegance. Your journey to extraordinary hospitality begins
              here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-none px-8 bg-white text-black hover:bg-white/90 hover:text-black"
              >
                <Link href="/hotels">
                  Explore Hotels <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-none px-8 bg-white text-black hover:bg-white/10"
              >
                <Link href="/check-in">Web Check-in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Featured Destinations
            </h2>
            <div className="w-20 h-px bg-primary mb-6"></div>
            <p className="text-muted-foreground max-w-2xl">
              Curated selection of our most exceptional properties, each
              offering a unique blend of luxury, comfort, and unforgettable
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel: Hotel) => (
              <div
                key={hotel.id}
                className="group relative overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      hotel.imageUrl ||
                      "/placeholder.svg?height=600&width=800&text=Luxury%20Hotel"
                    }
                    alt={hotel.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-2">{hotel.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {hotel.city}, {hotel.state}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      <span className="text-lg">
                        {hotel._count?.rooms || "N/A"}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        rooms available
                      </span>
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                    >
                      <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none px-8"
            >
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-light">
                Exceptional Experiences Await
              </h2>
              <div className="w-20 h-px bg-primary mb-6"></div>
              <p className="text-muted-foreground">
                Our curated collection of luxury accommodations offers more than
                just a place to stay—it provides a gateway to unforgettable
                experiences.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized concierge service",
                  "Exclusive access to local experiences",
                  "Complimentary premium amenities",
                  "Seamless digital check-in",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full border border-primary flex items-center justify-center mr-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-none px-8 mt-4">
                <Link href="/auth/signup">
                  Join Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[500px] overflow-hidden">
              <Image
                src="/placeholder.svg?height=1000&width=800&text=Luxury%20Experience"
                alt="Luxury hotel experience"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Guest Experiences
            </h2>
            <div className="w-20 h-px bg-primary mb-6"></div>
            <p className="text-muted-foreground max-w-2xl">
              Hear from our guests about their extraordinary stays and memorable
              moments at our luxury properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alexandra Smith",
                location: "New York, USA",
                quote:
                  "An absolutely breathtaking experience. The attention to detail and personalized service exceeded all expectations.",
              },
              {
                name: "James Wilson",
                location: "London, UK",
                quote:
                  "From the moment I arrived, I was treated with exceptional care. The property was stunning and the amenities were world-class.",
              },
              {
                name: "Sophia Chen",
                location: "Singapore",
                quote:
                  "The perfect blend of luxury and comfort. The digital check-in process was seamless, and the staff anticipated our every need.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-muted/20 p-8 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
                <blockquote className="text-lg mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">
            Begin Your Luxury Journey Today
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Create an account to unlock exclusive benefits, member rates, and
            personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-none px-8"
            >
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/hotels">Explore Hotels</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

