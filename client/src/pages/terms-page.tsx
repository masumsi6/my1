import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, AlertTriangle, Scale, Users } from "lucide-react";

export default function TermsPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          {/* Agreement */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using LinkTree Pro ("Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Use License</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  Permission is granted to temporarily download one copy of LinkTree Pro per device for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">User Accounts</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You are responsible for safeguarding the password and all activities under your account</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>You may not use another user's account without permission</li>
                    <li>You may not create accounts for others without their permission</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-semibold">Prohibited Uses</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>You may not use our service:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track the personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content Policy */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Content Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You retain ownership of content you post on LinkTree Pro. However, by posting content, 
                  you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content.
                </p>
                <div>
                  <h3 className="text-lg font-medium mb-2">Content Guidelines</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Content must comply with all applicable laws</li>
                    <li>No hate speech, harassment, or bullying</li>
                    <li>No spam or misleading content</li>
                    <li>No copyrighted material without permission</li>
                    <li>No adult content or explicit material</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. 
                  We may temporarily suspend the service for maintenance, updates, or other operational reasons.
                </p>
                <p>
                  We reserve the right to withdraw or amend this service, and any service or material we provide, 
                  in our sole discretion without notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  In no event shall LinkTree Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                  loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                  under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using the service and delete your account through your profile settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. 
                  By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: legal@linktreepro.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Tech Street, Silicon Valley, CA 94000</p>
              </div>
            </CardContent>
          </Card>
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