import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { MobilePreview } from "@/components/mobile-preview";
import { AnimatedBackground } from "@/components/animated-background";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, Ban, User, Share2, QrCode, Copy, Download, Heart, ThumbsDown, Flag, Plus, Home, Minus } from "lucide-react";
import { Link } from "wouter";
import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaTelegram, FaWhatsapp, FaDiscord, FaPinterest, FaTumblr, FaWeixin, FaFacebookMessenger, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfileData {
  profile: any;
  links: any[];
  socialLinks: any[];
  user: {
    username: string;
    name: string;
  };
}

export default function ProfilePage() {
  const [match, params] = useRoute("/:username");
  const username = params?.username;
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();

  const profileUrl = `${window.location.origin}/${username}`;

  useEffect(() => {
    if (username) {
      QRCode.toDataURL(profileUrl, { width: 200, margin: 2 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [profileUrl, username]);

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
    link.download = `${username}_qr_code.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Profile`,
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

  // Reaction mutations
  const loveReactionMutation = useMutation({
    mutationFn: async (profileId: number) => {
      const response = await apiRequest("POST", "/api/profile-reactions", {
        profileId,
        type: "love"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your reaction has been recorded",
      });
      refetchReactionCounts();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dislikeReactionMutation = useMutation({
    mutationFn: async (profileId: number) => {
      const response = await apiRequest("POST", "/api/profile-reactions", {
        profileId,
        type: "dislike"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded",
      });
      refetchReactionCounts();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reportReactionMutation = useMutation({
    mutationFn: async (data: { profileId: number; reason: string }) => {
      const response = await apiRequest("POST", "/api/profile-reactions", {
        profileId: data.profileId,
        type: "report",
        reason: data.reason
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We will review it shortly.",
      });
      setShowReportDialog(false);
      setReportReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLove = () => {
    if (profileData?.profile?.id) {
      loveReactionMutation.mutate(profileData.profile.id);
    }
  };

  const handleDislike = () => {
    if (profileData?.profile?.id) {
      dislikeReactionMutation.mutate(profileData.profile.id);
    }
  };

  const handleReport = () => {
    if (profileData?.profile?.id && reportReason.trim()) {
      reportReactionMutation.mutate({
        profileId: profileData.profile.id,
        reason: reportReason.trim()
      });
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

  const { data: profileData, isLoading, error } = useQuery<ProfileData>({
    queryKey: ["/api/profile", username],
    enabled: !!username,
  });

  const { data: reactionCounts, refetch: refetchReactionCounts } = useQuery({
    queryKey: [`/api/profile-reaction-counts/${profileData?.profile?.id}`],
    enabled: !!profileData?.profile?.id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-4">
              The profile you're looking for doesn't exist or has been suspended.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, links, socialLinks, user } = profileData;

  // Check if account is suspended
  if (error && error.message.includes("suspended")) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>
            <p className="text-gray-600 mb-4">
              This account has been suspended. Please contact support for more information.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header for all devices */}
      <div className={cn("shadow-lg border-b relative z-10", getThemeClasses(profileData?.profile?.theme || "gradient-purple"))}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h2 className={cn("text-xl font-black drop-shadow-lg", 
              profileData?.profile?.theme === "minimal" ? "text-gray-800" : "text-white")}>
              LinkTree Pro
            </h2>
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className={cn("font-semibold shadow-lg hover:shadow-xl hover:animate-none backdrop-blur-sm",
                  profileData?.profile?.theme === "minimal" 
                    ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600" 
                    : "bg-white/90 hover:bg-white text-gray-800 border-white/50"
                )}
                style={{
                  animation: 'shake 5s ease-in-out infinite'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your own
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-center min-h-screen p-8 relative z-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
          
          <MobilePreview
            profile={profile}
            links={links}
            socialLinks={socialLinks}
            user={user}
            isPublic={true}
          />
          
          {/* Desktop Reaction Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLove}
              disabled={loveReactionMutation.isPending}
              className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            >
              <Heart className="w-4 h-4" />
              <span>Love</span>
              {reactionCounts?.love > 0 && (
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 border-green-300">
                  {reactionCounts.love}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={dislikeReactionMutation.isPending}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Dislike</span>
              {reactionCounts?.dislike > 0 && (
                <Badge variant="destructive" className="ml-1 bg-red-100 text-red-800 border-red-300">
                  {reactionCounts.dislike}
                </Badge>
              )}
            </Button>
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Reason for reporting</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe why you're reporting this profile..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReport}
                      disabled={!reportReason.trim() || reportReactionMutation.isPending}
                    >
                      {reportReactionMutation.isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center text-sm text-gray-500 space-y-2">
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

      {/* Mobile and Tablet view - using mobile frame */}
      <div className="md:hidden min-h-screen flex items-start justify-center pt-8 relative z-10">
        <div className="w-full">
          {/* Mobile Frame - Compressed */}
          <div className="border-2 border-black rounded-3xl w-full max-w-xs mx-auto h-[600px]">
            <div className="overflow-hidden w-full h-full relative flex flex-col">
              {/* Galaxy S25 Ultra Screen */}
              <div className="bg-white rounded-t-3xl overflow-hidden relative flex flex-col flex-1">
                {/* Status Bar */}
                <div className="bg-white px-4 py-2 flex justify-between items-center text-xs font-medium">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                      <div className="w-1 h-1 bg-black rounded-full"></div>
                    </div>
                    <div className="w-6 h-3 border border-black rounded-sm relative">
                      <div className="absolute right-0 top-0 w-1 h-1 bg-black rounded-full"></div>
                      <div className="absolute inset-0.5 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
            
            {/* Profile Header */}
            <div className={cn("px-6 py-8 text-white text-center", getThemeClasses(profile.theme || "gradient-purple"))}>
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-lg font-bold mb-2">{profile.displayName || `@${user.username}`}</h1>
              <p className={cn("text-sm", profile.theme === "minimal" ? "text-gray-600" : "text-white/90")}>
                {profile.bio || "Welcome to my links"}
              </p>
            </div>
            
            {/* Links Section - Combined Custom + Social Links */}
            <div className="p-4 space-y-3 bg-white flex-1 overflow-y-auto pb-16">
              {/* All Links Combined */}
              {/* Custom Links First */}
              {links && links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block bg-gray-800 text-white text-center py-2.5 px-8 font-semibold hover:bg-gray-700 transition-all duration-300 w-full shadow-lg hover:shadow-xl hover:scale-105 border border-white/20",
                    getButtonClasses(profile.buttonStyle || "rounded")
                  )}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="capitalize">{link.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              ))}
              
              {/* Social Links After Custom Links */}
              {socialLinks && socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block text-white text-center py-2.5 px-8 font-semibold transition-all duration-300 w-full shadow-lg hover:shadow-xl hover:scale-105 border border-white/20",
                    getSocialColor(social.platform),
                    getButtonClasses(profile.buttonStyle || "rounded")
                  )}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {getSocialIcon(social.platform)}
                    <span className="capitalize">{social.platform}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              ))}
              
              {/* Empty state if no links */}
              {(!socialLinks || socialLinks.length === 0) && (!links || links.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No links added yet</p>
                </div>
              )}
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
          
          {/* Share Profile Button - Only show when QR code is enabled */}
          {profile.enableQrCode !== false && (
            <div className="mt-6 flex justify-center">
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-800 border-gray-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share This Profile</DialogTitle>
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

          {/* Mobile Reaction Buttons - Below the frame */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLove}
              disabled={loveReactionMutation.isPending}
              className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            >
              <Heart className="w-4 h-4" />
              <span>Love</span>
              {reactionCounts?.love > 0 && (
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 border-green-300">
                  {reactionCounts.love}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={dislikeReactionMutation.isPending}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Dislike</span>
              {reactionCounts?.dislike > 0 && (
                <Badge variant="destructive" className="ml-1 bg-red-100 text-red-800 border-red-300">
                  {reactionCounts.dislike}
                </Badge>
              )}
            </Button>
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Reason for reporting</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe why you're reporting this profile..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReport}
                      disabled={!reportReason.trim() || reportReactionMutation.isPending}
                    >
                      {reportReactionMutation.isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4 space-y-2">
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
  );
}
