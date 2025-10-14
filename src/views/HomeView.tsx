"use client";

import Image from "next/image";
import {
  Camera,
  CheckCircle,
  Star,
  Users,
  Award,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { constants } from "../constants";
import BusinessLocationCard from "../components/BusinessLocationCard";
import { formatPrice } from "../utils/formatPrice";
import type { SpecCode } from "../models/PhotoSpec";
import ProductPackageCard from "../components/ProductPackageCard";
import sampleImageUrl from "../assets/20250617-135306.jpeg";
import { useRef } from "react";
import NavItem from "../lib/nav-item";

function HomeView() {
  const router = useRouter();

  const servicesSectionRef = useRef<HTMLDivElement | null>(null);
  const pricingSectionRef = useRef<HTMLDivElement | null>(null);
  const locationsSectionRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const productPackage = constants.productPackages[1];
  const formattedPrice = formatPrice(
    productPackage.priceCents,
    productPackage.currency,
  );

  const navItems = [
    {
      label: "Services",
      handler: () => {
        servicesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      label: "Pricing",
      handler: () => {
        pricingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      label: "Locations",
      handler: () => {
        locationsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      label: "Contact",
      handler: () => {
        contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const serviceItems = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "US Passport Photos",
      description:
        'Official 2" x 2" passport photos that meet State Department requirements',
      price: formattedPrice,
      features: [
        '2" x 2" size',
        "White background",
        "Biometric compliant",
        "Same day pickup",
      ],
      specCode: "us-passport" satisfies SpecCode,
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Visa Photos",
      description: "Photos for visa applications to any country worldwide",
      price: formattedPrice,
      features: [
        "Country-specific sizing",
        "Professional retouching",
        "Multiple copies",
        "Digital delivery",
      ],
      specCode: "us-visa" satisfies SpecCode,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Green Card Photos",
      description: "USCIS-compliant photos for permanent resident applications",
      price: formattedPrice,
      features: [
        "USCIS standards",
        "Proper lighting",
        "Head positioning",
        "Quality guarantee",
      ],
      specCode: "us-greencard" satisfies SpecCode,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {constants.studioName}
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((it, index) => (
                <button
                  key={index}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => {
                    it.handler();
                  }}
                >
                  {it.label}
                </button>
              ))}
            </nav>

            <NavItem href="/make-photo">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors hidden md:block">
                Make Photo Online
              </button>
            </NavItem>

            <button className="md:hidden">
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-gray-700"></span>
                <span className="w-full h-0.5 bg-gray-700"></span>
                <span className="w-full h-0.5 bg-gray-700"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-blue-100">
                  Rated 4.9/5 by 2,500+ customers
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Professional Passport Photos
                <span className="block text-blue-200">Ready in 10 Minutes</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Get government-compliant passport, visa, and ID photos with our
                professional equipment. Guaranteed acceptance or your money
                back.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <NavItem
                  href="/make-photo"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg text-center"
                >
                  Create Photos Online
                </NavItem>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
                  Visit Our Studio
                </button>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">100% Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">Same Day Service</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Image src={sampleImageUrl} alt="Sample image" />
                    {/* <Camera className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Professional Quality</p>
                    <p className="text-gray-400 text-sm">2" x 2" Passport Photo</p> */}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 font-semibold">
                    Government Compliant
                  </p>
                  <p className="text-gray-500 text-sm">
                    Meets all official requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesSectionRef} className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Photo Services
            </h2>
            <p className="text-xl text-gray-600">
              Professional photos for all your official document needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceItems.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-600">{service.icon}</div>
                  <span className="text-2xl font-bold text-blue-600">
                    {service.price}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Walk-ins welcome
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {constants.studioName}?
            </h2>
            <p className="text-xl text-gray-600">
              Professional service you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12" />,
                title: "100% Guarantee",
                description:
                  "If your photos are rejected, we'll retake them for free or refund your money",
              },
              {
                icon: <Zap className="h-12 w-12" />,
                title: "10-Minute Service",
                description:
                  "Walk in and walk out with professional photos in just 10 minutes",
              },
              {
                icon: <Award className="h-12 w-12" />,
                title: "Government Compliant",
                description:
                  "All photos meet strict government standards and requirements",
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Expert Staff",
                description:
                  "Trained professionals with years of experience in official photography",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingSectionRef} className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees, no surprises
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {constants.productPackages.map((pkg) => (
              <ProductPackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={pkg.isPopular}
                onBuyClick={(pkg) => {
                  router.push(`/make-photo?pkgId=${pkg.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section ref={locationsSectionRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Locations
            </h2>
          </div>

          <div className="flex justify-center">
            {constants.businessLocations.map((loc) => (
              <BusinessLocationCard key={loc.address} location={loc} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Photos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't wait in long lines at the post office. Get professional
            passport photos in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavItem
              href="/make-photo"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors text-center"
            >
              Create Photos Online
            </NavItem>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Find a Location
            </button>
          </div>

          <div className="mt-8 text-blue-100">
            <p>
              Questions? Call us at{" "}
              <span className="font-semibold">
                {constants.businessLocations[0]?.email}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={contactSectionRef} className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">
                  {constants.studioName}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Professional passport and ID photo services with guaranteed
                government compliance. Serving New York City with fast, reliable
                service since 2015.
              </p>
              <div className="flex space-x-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  4.9/5 from 2,500+ reviews
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Passport Photos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Visa Photos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Driver's License
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Green Card Photos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Professional Headshots
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                {constants.businessLocations.map((loc) => (
                  <li key={loc.address}>{`${loc.address}: ${loc.email}`}</li>
                ))}
                <li>Open 7 days a week</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-gray-400">
                &copy; 2024 {constants.studioName}. All rights reserved.
              </p>
              <a
                href="https://idphoto.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Power by IdPhoto.AI - Passport Photo API provider.
              </a>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeView;
