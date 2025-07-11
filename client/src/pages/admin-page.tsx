import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { Users, Link, MousePointer, Ban, LogOut, Edit, Pause, Play, Trash2, Heart, ThumbsDown, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  const [adminAuth, setAdminAuth] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", creds);
      return response.json();
    },
    onSuccess: () => {
      setAdminAuth(true);
      toast({ title: "Admin login successful!" });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: adminAuth,
  });

  // Fetch profile reactions
  const { data: reactions = [] } = useQuery({
    queryKey: ["/api/admin/profile-reactions"],
    enabled: adminAuth,
  });

  // Suspend user mutation
  const suspendMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("POST", `/api/admin/suspend/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User suspended successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error suspending user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unsuspend user mutation
  const unsuspendMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("POST", `/api/admin/unsuspend/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User unsuspended successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error unsuspending user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = () => {
    adminLoginMutation.mutate(credentials);
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setCredentials({ username: "", password: "" });
  };

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Admin username"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Admin password"
              />
            </div>
            <Button 
              onClick={handleAdminLogin}
              disabled={adminLoginMutation.isPending}
              className="w-full"
            >
              {adminLoginMutation.isPending ? "Logging in..." : "Admin Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalLinks: users.reduce((acc, user) => acc + (user.id || 0), 0), // Placeholder
    totalClicks: 12345, // Placeholder
    suspended: users.filter(user => user.isSuspended).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Links</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Suspended</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for User Management and Profile Reactions */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reactions">Profile Reactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-900">@{user.username}</TableCell>
                        <TableCell className="text-sm text-gray-900">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isSuspended ? "destructive" : "default"}>
                            {user.isSuspended ? "Suspended" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.isSuspended ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => unsuspendMutation.mutate(user.id)}
                                disabled={unsuspendMutation.isPending}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => suspendMutation.mutate(user.id)}
                                disabled={suspendMutation.isPending}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(user.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Reactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No reactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      reactions.map((reaction: any) => (
                        <TableRow key={reaction.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {reaction.type === 'love' && (
                                <Heart className="w-4 h-4 mr-2 text-pink-600" />
                              )}
                              {reaction.type === 'dislike' && (
                                <ThumbsDown className="w-4 h-4 mr-2 text-gray-600" />
                              )}
                              {reaction.type === 'report' && (
                                <Flag className="w-4 h-4 mr-2 text-red-600" />
                              )}
                              <Badge 
                                variant={
                                  reaction.type === 'love' ? 'default' : 
                                  reaction.type === 'dislike' ? 'secondary' : 'destructive'
                                }
                              >
                                {reaction.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            Profile ID: {reaction.profileId}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            {reaction.ipAddress}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            {reaction.reason || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">
                            {new Date(reaction.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
