import { cn } from "@/lib/utils";
import { User, ExternalLink, Share2, QrCode, Copy, Download, ArrowLeft, Home, Minus } from "lucide-react";
import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaTelegram, FaWhatsapp, FaDiscord, FaPinterest, FaTumblr, FaWeixin, FaFacebookMessenger, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface MobilePreviewProps {
  profile: {
    displayName?: string;
    bio?: string;
    theme?: string;
    buttonStyle?: string;
    buttonColor?: string;
    profilePicture?: string;
    enableQrCode?: boolean;
  };
  links: Array<{
    id: number;
    title: string;
    url: string;
    icon?: string;
  }>;
  socialLinks: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
  user?: {
    username: string;
    name: string;
  };
  isPublic?: boolean;
  className?: string;
}

export function MobilePreview({ 
  profile, 
  links, 
  socialLinks, 
  user, 
  isPublic = false,
  className 
}: MobilePreviewProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();

  const profileUrl = user ? `${window.location.origin}/${user.username}` : "";

  useEffect(() => {
    if (profileUrl) {
      QRCode.toDataURL(profileUrl, { width: 200, margin: 2 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [profileUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `${user?.username}_qr_code.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName || user?.username}'s Profile`,
          text: `Check out my profile: ${profile.bio || ''}`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Share was cancelled');
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "gradient-purple":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "gradient-blue":
        return "bg-gradient-to-br from-blue-500 to-cyan-500";
      case "gradient-green":
        return "bg-gradient-to-br from-green-500 to-teal-500";
      case "gradient-orange":
        return "bg-gradient-to-br from-orange-500 to-red-500";
      case "dark":
        return "bg-gray-900";
      case "minimal":
        return "bg-white text-gray-900";
      default:
        return "bg-gradient-to-br from-purple-500 to-pink-500";
    }
  };

  const getButtonClasses = (buttonStyle: string) => {
    switch (buttonStyle) {
      case "rounded":
        return "rounded-xl";
      case "square":
        return "rounded-none";
      case "pill":
        return "rounded-full";
      default:
        return "rounded-xl";
    }
  };

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5 text-white" };
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebookF {...iconProps} />;
      case "instagram":
        return <FaInstagram {...iconProps} />;
      case "tiktok":
        return <FaTiktok {...iconProps} />;
      case "x":
        return <FaXTwitter {...iconProps} />;
      case "telegram":
        return <FaTelegram {...iconProps} />;
      case "whatsapp":
        return <FaWhatsapp {...iconProps} />;
      case "youtube":
        return <FaYoutube {...iconProps} />;
      case "linkedin":
        return <FaLinkedinIn {...iconProps} />;
      case "discord":
        return <FaDiscord {...iconProps} />;
      case "pinterest":
        return <FaPinterest {...iconProps} />;
      case "website":
        return <FaGlobe {...iconProps} />;
      case "tumblr":
        return <FaTumblr {...iconProps} />;
      case "wechat":
        return <FaWeixin {...iconProps} />;
      case "messenger":
        return <FaFacebookMessenger {...iconProps} />;
      case "email":
        return <FaEnvelope {...iconProps} />;
      // Legacy support for older links
      case "twitter":
        return <FaXTwitter {...iconProps} />;
      default:
        return <span className="text-sm font-medium text-white">{platform[0].toUpperCase()}</span>;
    }
  };

  const getSocialColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "bg-[#1877F2] hover:bg-[#166fe5]";
      case "instagram":
        return "bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#d63384] hover:to-[#7529a3]";
      case "tiktok":
        return "bg-[#000000] hover:bg-[#333333]";
      case "x":
        return "bg-[#000000] hover:bg-[#333333]";
      case "telegram":
        return "bg-[#0088cc] hover:bg-[#0077b3]";
      case "whatsapp":
        return "bg-[#25D366] hover:bg-[#1ebe5a]";
      case "youtube":
        return "bg-[#FF0000] hover:bg-[#e60000]";
      case "linkedin":
        return "bg-[#0A66C2] hover:bg-[#0958a5]";
      case "discord":
        return "bg-[#5865F2] hover:bg-[#4752c4]";
      case "pinterest":
        return "bg-[#E60023] hover:bg-[#d50021]";
      case "website":
        return "bg-[#6B7280] hover:bg-[#4B5563]";
      case "tumblr":
        return "bg-[#00CF35] hover:bg-[#00b82f]";
      case "wechat":
        return "bg-[#07C160] hover:bg-[#06ad55]";
      case "messenger":
        return "bg-[#00B2FF] hover:bg-[#0099e6]";
      case "email":
        return "bg-[#D44638] hover:bg-[#c23321]";
      // Legacy support for older links
      case "twitter":
        return "bg-[#000000] hover:bg-[#333333]";
      default:
        return "bg-gray-800 hover:bg-gray-700";
    }
  };

  const getButtonColor = (buttonColor: string) => {
    switch (buttonColor) {
      case "purple":
        return "bg-purple-600 hover:bg-purple-700";
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      case "green":
        return "bg-green-600 hover:bg-green-700";
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "yellow":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "pink":
        return "bg-pink-600 hover:bg-pink-700";
      case "indigo":
        return "bg-indigo-600 hover:bg-indigo-700";
      case "teal":
        return "bg-teal-600 hover:bg-teal-700";
      case "orange":
        return "bg-orange-600 hover:bg-orange-700";
      case "gray":
        return "bg-gray-600 hover:bg-gray-700";
      default:
        return "bg-gray-800 hover:bg-gray-700";
    }
  };

  const getCustomLinkColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-orange-600 hover:bg-orange-700";
      case 1:
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-800 hover:bg-gray-700";
    }
  };

  const handleLinkClick = (url: string) => {
    if (isPublic) {
      window.open(url, "_blank", "noopener noreferrer");
    }
  };

  return (
    <div className={cn("relative border-2 border-black rounded-3xl w-full max-w-xs mx-auto", className)}>
      <div className="overflow-hidden w-full h-[600px] relative flex flex-col">
        {/* Galaxy S25 Ultra Screen */}
        <div className="bg-white rounded-t-3xl overflow-hidden relative flex flex-col flex-1">
          {/* Status Bar */}
          <div className="bg-white px-4 sm:px-6 py-2 flex justify-between items-center text-xs sm:text-sm font-medium">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-0.5">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-black rounded-sm relative">
                <div className="absolute inset-0.5 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        
        {/* Profile Header */}
        <div className={cn("px-3 sm:px-5 py-4 sm:py-6 text-white text-center", getThemeClasses(profile.theme || "gradient-purple"))}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-2">
            {profile.displayName || (user ? `@${user.username}` : "@yourname")}
          </h3>
          <p className={cn("text-xs sm:text-sm px-2", profile.theme === "minimal" ? "text-gray-600" : "text-white/90")}>
            {profile.bio || "Add your bio here..."}
          </p>
        </div>
        
        {/* Links - Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-5 space-y-2 sm:space-y-3 pb-16">
            {/* Custom Links First */}
            {links && links.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    onClick={() => handleLinkClick(link.url)}
                    className={cn(
                      "text-white text-center py-2 sm:py-2.5 px-6 sm:px-8 font-semibold transition-all duration-300 flex items-center justify-center space-x-2 w-full shadow-lg hover:shadow-xl hover:scale-105 border border-white/20",
                      getCustomLinkColor(index),
                      getButtonClasses(profile.buttonStyle || "rounded"),
                      isPublic ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span className="capitalize text-sm sm:text-base">{link.title}</span>
                    {isPublic && <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </div>
                ))}
              </div>
            )}
            
            {/* Social Links Second */}
            {socialLinks.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                {socialLinks.map((social) => (
                  <div
                    key={social.id}
                    onClick={() => isPublic && handleLinkClick(social.url)}
                    className={cn(
                      "text-white text-center py-2 sm:py-2.5 px-6 sm:px-8 font-semibold transition-all duration-300 flex items-center justify-center space-x-2 w-full shadow-lg hover:shadow-xl hover:scale-105 border border-white/20",
                      getSocialColor(social.platform),
                      getButtonClasses(profile.buttonStyle || "rounded"),
                      isPublic ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {getSocialIcon(social.platform)}
                    <span className="capitalize text-sm sm:text-base">{social.platform}</span>
                    {isPublic && <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </div>
                ))}
              </div>
            )}

            {/* QR Code and Share Button */}
            {user && !isPublic && profile.enableQrCode !== false && (
            <div className="mt-4 space-y-3">
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 text-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Profile URL */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Profile Link</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={profileUrl}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                        />
                        <Button size="sm" onClick={handleCopyLink}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* QR Code */}
                    {profile.enableQrCode !== false && (
                      <div className="text-center">
                        <label className="text-sm font-medium mb-2 block">QR Code</label>
                        {qrCodeDataUrl && (
                          <div className="flex flex-col items-center space-y-3">
                            <img
                              src={qrCodeDataUrl}
                              alt="Profile QR Code"
                              className="border rounded-lg"
                            />
                            <Button size="sm" variant="outline" onClick={handleDownloadQR}>
                              <Download className="w-4 h-4 mr-2" />
                              Download QR Code
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Share Button */}
                    <Button onClick={handleShare} className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-4 text-center text-xs text-gray-500 space-y-2">
            <p>Powered by LinkTree Pro</p>
            <button 
              onClick={() => window.open('mailto:support@linktreepro.com', '_blank')}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Contact Us
            </button>
          </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Navigation Buttons Under Frame */}
      <div className="bg-black rounded-b-3xl px-12 py-3 mb-2 w-full max-w-lg mx-auto">
        <div className="flex justify-center items-center space-x-8">
          <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
            <Home className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
            <Minus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
