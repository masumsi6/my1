import { Button } from "@/components/ui/button";
import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaTelegram, FaWhatsapp, FaDiscord, FaPinterest, FaTumblr, FaWeixin, FaFacebookMessenger, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialIconsProps {
  onSocialClick: (platform: string) => void;
  existingPlatforms?: string[];
}

export function SocialIcons({ onSocialClick, existingPlatforms = [] }: SocialIconsProps) {
  const socialPlatforms = [
    { id: "facebook", name: "Facebook", icon: FaFacebookF, color: "bg-[#1877F2] hover:bg-[#166fe5]" },
    { id: "instagram", name: "Instagram", icon: FaInstagram, color: "bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#d63384] hover:to-[#7529a3]" },
    { id: "tiktok", name: "TikTok", icon: FaTiktok, color: "bg-[#000000] hover:bg-[#333333]" },
    { id: "x", name: "X", icon: FaXTwitter, color: "bg-[#000000] hover:bg-[#333333]" },
    { id: "telegram", name: "Telegram", icon: FaTelegram, color: "bg-[#0088cc] hover:bg-[#0077b3]" },
    { id: "whatsapp", name: "WhatsApp", icon: FaWhatsapp, color: "bg-[#25D366] hover:bg-[#1ebe5a]" },
    { id: "youtube", name: "YouTube", icon: FaYoutube, color: "bg-[#FF0000] hover:bg-[#e60000]" },
    { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn, color: "bg-[#0A66C2] hover:bg-[#0958a5]" },
    { id: "discord", name: "Discord", icon: FaDiscord, color: "bg-[#5865F2] hover:bg-[#4752c4]" },
    { id: "pinterest", name: "Pinterest", icon: FaPinterest, color: "bg-[#E60023] hover:bg-[#d50021]" },
    { id: "website", name: "Website", icon: FaGlobe, color: "bg-[#6B7280] hover:bg-[#4B5563]" },
    { id: "tumblr", name: "Tumblr", icon: FaTumblr, color: "bg-[#00CF35] hover:bg-[#00b82f]" },
    { id: "wechat", name: "WeChat", icon: FaWeixin, color: "bg-[#07C160] hover:bg-[#06ad55]" },
    { id: "messenger", name: "Messenger", icon: FaFacebookMessenger, color: "bg-[#00B2FF] hover:bg-[#0099e6]" },
    { id: "email", name: "Email", icon: FaEnvelope, color: "bg-[#D44638] hover:bg-[#c23321]" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon;
        const isAdded = existingPlatforms.includes(platform.id);
        
        return (
          <Button
            key={platform.id}
            onClick={() => onSocialClick(platform.id)}
            disabled={isAdded}
            className={`aspect-square text-white rounded-xl flex items-center justify-center transition-all relative ${platform.color} ${isAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
            size="lg"
          >
            {isAdded && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center text-sm z-10 shadow-lg">
                😊
              </div>
            )}
            <Icon className="w-6 h-6" />
          </Button>
        );
      })}
    </div>
  );
}
