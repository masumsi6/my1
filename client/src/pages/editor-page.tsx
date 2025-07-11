import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MobilePreview } from "@/components/mobile-preview";
import { AnimatedBackground } from "@/components/animated-background";
import { SocialIcons } from "@/components/social-icons";
import { useState, useEffect } from "react";
import { Link, Upload, Check, X, Plus, Rocket, LogOut, Edit2, Trash2 } from "lucide-react";
import { Profile, Link as LinkType, SocialLink } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaTelegram, FaWhatsapp, FaDiscord, FaPinterest, FaTumblr, FaWeixin, FaFacebookMessenger, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function EditorPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    theme: "gradient-purple",
    buttonStyle: "rounded",
    profilePicture: "",
    enableQrCode: true
  });
  
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [showAddLink, setShowAddLink] = useState(false);
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);


  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  // Fetch links
  const { data: links = [] } = useQuery<LinkType[]>({
    queryKey: ["/api/links"],
    enabled: !!user,
  });

  // Fetch social links
  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
    enabled: !!user,
  });

  // Update profile data when loaded
  useEffect(() => {
    if (profile) {
      setProfileData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        theme: profile.theme || "gradient-purple",
        buttonStyle: profile.buttonStyle || "rounded",
        profilePicture: profile.profilePicture || "",
        enableQrCode: profile.enableQrCode ?? true
      });
    }
  }, [profile]);

  // Set initial username
  useEffect(() => {
    if (user && !usernameInput) {
      setUsernameInput(user.username);
    }
  }, [user, usernameInput]);

  // Check username availability
  const checkUsername = async (username: string) => {
    if (!username || username === user?.username) return;
    
    setUsernameStatus("checking");
    try {
      const response = await fetch(`/api/check-username/${username}`);
      const data = await response.json();
      setUsernameStatus(data.available ? "available" : "taken");
    } catch (error) {
      setUsernameStatus("idle");
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (usernameInput !== user?.username) {
        checkUsername(usernameInput);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [usernameInput, user?.username]);

  // Create/Update profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const method = profile ? "PUT" : "POST";
      const response = await apiRequest(method, "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Profile saved successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add link mutation
  const addLinkMutation = useMutation({
    mutationFn: async (linkData: { title: string; url: string; isActive: boolean; order: number }) => {
      const response = await apiRequest("POST", "/api/links", linkData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      setNewLink({ title: "", url: "" });
      setShowAddLink(false);
      toast({ title: "Link added successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error adding link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: number) => {
      await apiRequest("DELETE", `/api/links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add social link mutation
  const addSocialLinkMutation = useMutation({
    mutationFn: async (socialData: { platform: string; url: string; isActive: boolean }) => {
      const response = await apiRequest("POST", "/api/social-links", socialData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link added successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error adding social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update social link mutation
  const updateSocialLinkMutation = useMutation({
    mutationFn: async (data: { id: number; platform: string; url: string }) => {
      const response = await apiRequest("PUT", `/api/social-links/${data.id}`, {
        platform: data.platform,
        url: data.url
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link updated successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error updating social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete social link mutation
  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/social-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Social link deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting social link",
        description: error.message,
        variant: "destructive",
      });
    },
  });



  // Publish profile mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/publish");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ 
        title: "Profile published successfully!", 
        description: `Your profile is now live at /${user?.username}. You can view it by going to /${user?.username}`
      });
    },
    onError: (error) => {
      toast({
        title: "Error publishing profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    saveProfileMutation.mutate(profileData);
  };

  const handleAddLink = () => {
    if (links.length >= 2) {
      toast({
        title: "Maximum links reached",
        description: "You can only add up to 2 custom links.",
        variant: "destructive",
      });
      return;
    }
    
    if (newLink.title && newLink.url) {
      addLinkMutation.mutate({
        title: newLink.title,
        url: newLink.url,
        isActive: true,
        order: 0
      });
    }
  };

  const handleSocialClick = (platform: string) => {
    // Check if platform already exists
    const platformExists = socialLinks.some(link => link.platform === platform);
    if (platformExists) {
      toast({
        title: "Platform already added",
        description: "You can only add one link per social media platform.",
        variant: "destructive",
      });
      return;
    }
    
    setSocialPlatform(platform);
    setSocialUrl("");
    setEditingSocialId(null);
    setShowSocialDialog(true);
  };

  const handleEditSocial = (social: any) => {
    setSocialPlatform(social.platform);
    // Extract username from full URL
    const baseUrl = getSocialBaseUrl(social.platform);
    const username = social.url.startsWith(baseUrl) ? social.url.substring(baseUrl.length) : social.url;
    setSocialUrl(username);
    setEditingSocialId(social.id);
    setShowSocialDialog(true);
  };

  const handleDeleteSocial = (socialId: number) => {
    deleteSocialLinkMutation.mutate(socialId);
  };

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-4 h-4" };
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
        return <span className="text-sm font-medium">{platform[0].toUpperCase()}</span>;
    }
  };

  const getSocialBaseUrl = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "https://www.facebook.com/";
      case "instagram":
        return "https://www.instagram.com/";
      case "tiktok":
        return "https://www.tiktok.com/@";
      case "x":
        return "https://x.com/";
      case "twitter":
        return "https://x.com/";
      case "telegram":
        return "https://t.me/";
      case "whatsapp":
        return "https://wa.me/";
      case "youtube":
        return "https://www.youtube.com/@";
      case "linkedin":
        return "https://www.linkedin.com/in/";
      case "discord":
        return "https://discord.gg/";
      case "pinterest":
        return "https://www.pinterest.com/";
      case "website":
        return "https://";
      case "tumblr":
        return "https://www.tumblr.com/";
      case "wechat":
        return "https://www.wechat.com/";
      case "messenger":
        return "https://m.me/";
      case "email":
        return "mailto:";
      default:
        return "https://";
    }
  };

  const handleSocialSubmit = () => {
    if (socialUrl.trim()) {
      const baseUrl = getSocialBaseUrl(socialPlatform);
      const fullUrl = socialUrl.startsWith("http") ? socialUrl : baseUrl + socialUrl.trim();
      
      if (editingSocialId) {
        // Edit existing social link
        updateSocialLinkMutation.mutate({
          id: editingSocialId,
          platform: socialPlatform,
          url: fullUrl
        });
      } else {
        // Add new social link
        addSocialLinkMutation.mutate({ 
          platform: socialPlatform, 
          url: fullUrl,
          isActive: true
        });
      }
      setShowSocialDialog(false);
      setSocialUrl("");
      setEditingSocialId(null);
    }
  };



  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newProfileData = { ...profileData, profilePicture: result };
        setProfileData(newProfileData);
        // Auto-save profile after picture upload
        saveProfileMutation.mutate(newProfileData);
      };
      reader.readAsDataURL(file);
    }
  };

  const themes = [
    { id: "gradient-purple", name: "Purple Gradient", class: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: "gradient-blue", name: "Blue Gradient", class: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { id: "gradient-green", name: "Green Gradient", class: "bg-gradient-to-br from-green-500 to-teal-500" },
    { id: "gradient-orange", name: "Orange Gradient", class: "bg-gradient-to-br from-orange-500 to-red-500" },
    { id: "dark", name: "Dark Theme", class: "bg-gray-900" },
    { id: "minimal", name: "Minimal", class: "bg-white" },
  ];

  const buttonStyles = [
    { id: "rounded", name: "Rounded", class: "rounded-lg" },
    { id: "square", name: "Square", class: "rounded-none" },
    { id: "pill", name: "Pill", class: "rounded-full" },
  ];



  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="bg-white border-b relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Your Profile</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {publishMutation.isPending ? "Publishing..." : "Publish"}
            </Button>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* Left Panel - Editor */}
        <div className="lg:w-1/2 bg-white border-r overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                  <label htmlFor="profile-picture-upload">
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  {profileData.profilePicture && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newProfileData = { ...profileData, profilePicture: "" };
                        setProfileData(newProfileData);
                        // Auto-save profile after picture removal
                        saveProfileMutation.mutate(newProfileData);
                      }}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Username</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {window.location.origin}/
                </span>
                <Input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="yourname"
                  className="rounded-l-none"
                />
              </div>
              {usernameStatus === "checking" && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Checking availability...</span>
                </div>
              )}
              {usernameStatus === "available" && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Username is available!</span>
                </div>
              )}
              {usernameStatus === "taken" && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <X className="w-4 h-4" />
                  <span>Username is taken</span>
                </div>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Display Name</Label>
              <Input
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                placeholder="Your display name"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Bio</Label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell people about yourself... (200 words max)"
                rows={4}
                maxLength={200}
              />
              <div className="text-sm text-gray-500">
                {profileData.bio.length}/200 characters
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Choose Theme</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => setProfileData({ ...profileData, theme: theme.id })}
                    className={`cursor-pointer rounded-lg border-2 p-3 ${theme.class} ${
                      profileData.theme === theme.id ? "border-primary border-4" : "border-gray-300"
                    }`}
                  >
                    <div className="h-6 sm:h-8 bg-white/20 rounded mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 sm:h-2 bg-white/40 rounded"></div>
                      <div className="h-1.5 sm:h-2 bg-white/40 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Button Style</Label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {buttonStyles.map((style) => (
                  <Button
                    key={style.id}
                    variant={profileData.buttonStyle === style.id ? "default" : "outline"}
                    onClick={() => setProfileData({ ...profileData, buttonStyle: style.id })}
                    className={style.class}
                    size="sm"
                  >
                    {style.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Save Profile Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={saveProfileMutation.isPending}
              className="w-full"
            >
              {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>

            {/* Custom Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Custom Links ({links.length}/2)</Label>
                <Button
                  onClick={() => setShowAddLink(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  disabled={links.length >= 2}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
              
              <div className="space-y-3">
                {links.map((link) => (
                  <Card key={link.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-gray-500">{link.url}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLinkMutation.mutate(link.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Social Media Links</Label>
              <SocialIcons 
                onSocialClick={handleSocialClick} 
                existingPlatforms={socialLinks.map(link => link.platform)} 
              />
              
              {/* Display existing social links with edit/delete options */}
              {socialLinks.length > 0 && (
                <div className="space-y-2 mt-4">
                  {socialLinks.map((social) => (
                    <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {getSocialIcon(social.platform)}
                        </div>
                        <div>
                          <p className="font-medium text-sm capitalize">{social.platform}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">{social.url}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSocial(social)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSocial(social.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QR Code Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">QR Code Settings</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-qr"
                  checked={profileData.enableQrCode}
                  onCheckedChange={(checked) => {
                    const newProfileData = { ...profileData, enableQrCode: checked };
                    setProfileData(newProfileData);
                    // Auto-save when QR code setting changes
                    saveProfileMutation.mutate(newProfileData);
                  }}
                />
                <Label htmlFor="enable-qr">Enable QR Code sharing</Label>
              </div>
              <p className="text-sm text-gray-500">
                Allow visitors to share and download QR codes for your profile
              </p>
            </div>

            {/* Publish Button */}
            <div className="pt-6 border-t">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to go live?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Publish your profile to make it available at /{user?.username}
                  </p>
                  <Button
                    type="button"
                    onClick={() => publishMutation.mutate()}
                    disabled={publishMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    {publishMutation.isPending ? "Publishing..." : "Publish Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:w-1/2 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center p-4 sm:p-8 min-h-[400px] lg:min-h-0">
          <MobilePreview
            profile={profileData}
            links={links}
            socialLinks={socialLinks}
            user={user}
          />
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={showAddLink} onOpenChange={setShowAddLink}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link title"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddLink} disabled={addLinkMutation.isPending}>
                {addLinkMutation.isPending ? "Adding..." : "Add Link"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddLink(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Media Dialog */}
      <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSocialId ? "Edit" : "Add"} {socialPlatform.charAt(0).toUpperCase() + socialPlatform.slice(1)} Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Username</Label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-l-md border border-r-0 dark:border-gray-600">
                  {getSocialBaseUrl(socialPlatform)}
                </span>
                <Input
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="yourusername"
                  className="rounded-l-none border-l-0"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter only your username (without the full URL)
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSocialSubmit} disabled={addSocialLinkMutation.isPending || updateSocialLinkMutation.isPending}>
                {addSocialLinkMutation.isPending || updateSocialLinkMutation.isPending ? 
                  (editingSocialId ? "Updating..." : "Adding...") : 
                  (editingSocialId ? "Update Link" : "Add Link")}
              </Button>
              <Button variant="outline" onClick={() => setShowSocialDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
