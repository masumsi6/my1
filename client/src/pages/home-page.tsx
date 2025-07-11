import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { MobilePreview } from "@/components/mobile-preview";
import { Check, Palette, BarChart3, Smartphone, Youtube, Instagram, Twitter, Briefcase, Mail } from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/editor");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">LinkTree Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold leading-tight">
                  Everything you are. In one, simple link in bio.
                </h2>
                <p className="text-xl text-indigo-100">
                  Join millions of creators and businesses using our premium link management platform.
                </p>
              </div>
              
              {/* Premium Features */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Premium Features - All Free!</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">Unlimited Links</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">Premium Themes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">Custom URLs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">Social Media Icons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-white">No Ads</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link href="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Premium Mobile Demo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <MobilePreview
                  profile={{
                    displayName: "@creativepro",
                    bio: "Digital Creator & Designer",
                    theme: "gradient-purple",
                    buttonStyle: "rounded"
                  }}
                  links={[
                    { id: 1, title: "YouTube Channel", url: "#", icon: "youtube" },
                    { id: 2, title: "Instagram", url: "#", icon: "instagram" },
                    { id: 3, title: "Twitter", url: "#", icon: "twitter" },
                    { id: 4, title: "Portfolio", url: "#", icon: "briefcase" },
                    { id: 5, title: "Contact Me", url: "#", icon: "mail" }
                  ]}
                  socialLinks={[]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600">Powerful features to grow your audience and manage your online presence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Themes</h3>
                <p className="text-gray-600">Choose from beautiful, professionally designed themes that match your brand</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600">Track your performance with detailed analytics and insights</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-gray-600">Your links look perfect on every device, every time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LinkTree Pro</h3>
              <p className="text-gray-600">The all-in-one link management platform for creators and businesses.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Custom URLs</a></li>
                <li><a href="#" className="hover:text-gray-900">Premium Themes</a></li>
                <li><a href="#" className="hover:text-gray-900">Analytics</a></li>
                <li><a href="#" className="hover:text-gray-900">Social Links</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 LinkTree Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
