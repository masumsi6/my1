import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Users, Zap, Target, Award, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">LinkTree Pro</h1>
            </Link>
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About LinkTree Pro</h1>
          <p className="text-xl text-gray-600">Empowering creators and businesses to connect with their audience</p>
        </div>

        <div className="space-y-12">
          {/* Our Story */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Our Story</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  LinkTree Pro was born from a simple idea: everyone deserves a beautiful, professional way to share their online presence. 
                  We noticed that many link-in-bio services were either too expensive or lacked the features creators truly needed.
                </p>
                <p>
                  That's why we created LinkTree Pro - a completely free platform that gives you all the premium features you'd expect, 
                  without the premium price tag. We believe that building your online presence shouldn't break the bank.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Mission */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                To democratize online presence by providing powerful, professional tools that are accessible to everyone, 
                regardless of their budget or technical expertise.
              </p>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Optimized for speed and performance. Your links load instantly, keeping your audience engaged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
                <p className="text-gray-600">
                  Intuitive interface that makes creating and managing your links a breeze, even for beginners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-gray-600">
                  Reliable hosting with global CDN ensures your links work perfectly worldwide.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Values */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Our Values</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Accessibility</h3>
                  <p className="text-gray-700">
                    We believe powerful tools should be available to everyone, regardless of their financial situation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Simplicity</h3>
                  <p className="text-gray-700">
                    Complex features should be easy to use. We prioritize user experience in everything we build.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Innovation</h3>
                  <p className="text-gray-700">
                    We're constantly improving and adding new features based on user feedback and emerging trends.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Community</h3>
                  <p className="text-gray-700">
                    Our users are at the heart of everything we do. We build for the community, with the community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Highlight */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose LinkTree Pro?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">100% Free Forever</h4>
                      <p className="text-sm text-gray-600">No hidden fees, no premium tiers, no limitations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Beautiful Themes</h4>
                      <p className="text-sm text-gray-600">Professional designs that make your links stand out</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Custom Branding</h4>
                      <p className="text-sm text-gray-600">Make it yours with custom colors and styles</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Analytics & Insights</h4>
                      <p className="text-sm text-gray-600">Track your performance and understand your audience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Mobile Optimized</h4>
                      <p className="text-sm text-gray-600">Looks perfect on all devices and screen sizes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">24/7 Support</h4>
                      <p className="text-sm text-gray-600">We're here to help whenever you need us</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
              <div className="text-center">
                <p className="text-gray-700 leading-relaxed">
                  We're a small but passionate team of developers, designers, and creators who understand the challenges 
                  of building an online presence. We're committed to making LinkTree Pro the best platform for sharing your links.
                </p>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button>Get in Touch</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of creators who trust LinkTree Pro with their online presence.
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 LinkTree Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}