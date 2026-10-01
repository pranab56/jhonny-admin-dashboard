"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
} from "@/features/profile/profileApi";
import { baseURL } from "@/utils/BaseURL";

// --- Schemas ---
const profileInfoSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileInfoValues = z.infer<typeof profileInfoSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const { data: profileResponse, isLoading: isProfileLoading } = useGetMyProfileQuery({});
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const profileData = profileResponse?.data;

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
    return `${baseURL}/api/v1/uploads/${path}`;
  };

  // --- Form 1: Profile Info ---
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    reset: resetInfo,
    formState: { errors: infoErrors },
  } = useForm<ProfileInfoValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  // --- Form 2: Password ---
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Sync profile data to form once fetched
  useEffect(() => {
    if (profileData) {
      resetInfo({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        role: profileData.role || "",
      });
      if (profileData.profileImage) {
        setPreviewImage(getImageUrl(profileData.profileImage));
      }
    }
  }, [profileData, resetInfo]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onUpdateImageTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
  };

  const onInfoSubmit = async (data: ProfileInfoValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone) {
        formData.append("phone", data.phone);
      }
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const res = await updateMyProfile(formData).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
      setSelectedFile(null);
    } catch (error: unknown) {
      const errorMsg = (error as { data?: { message?: string } })?.data?.message || "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  const onPasswordSubmit = async (data: PasswordValues) => {
    try {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      toast.success(res?.message || "Password changed successfully!");
      resetPassword();
    } catch (error: unknown) {
      const errorMsg = (error as { data?: { message?: string } })?.data?.message || "Failed to change password";
      toast.error(errorMsg);
    }
  };

  if (isProfileLoading) {
    return <LoadingSpinner message="Loading profile details..." className="min-h-[60vh]" size={40} />;
  }

  const initials = profileData?.name
    ? profileData.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AD";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Profile Info Form */}
      <form onSubmit={handleSubmitInfo(onInfoSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none bg-white rounded-2xl shadow-none overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 rounded-full border-0">
                    <AvatarImage
                      src={previewImage}
                      alt={profileData?.name || "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={onUpdateImageTrigger}
                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform text-[#2ECC71]"
                  >
                    <div className="bg-[#E6F9F1] p-1 rounded-full">
                      <Camera size={14} />
                    </div>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-gray-800">Profile Photo</h3>
                  <p className="text-sm text-gray-400 font-medium">JPG, GIF or PNG. Max size of 2MB</p>
                  <div className="flex items-center gap-4 mt-1">
                    <button
                      type="button"
                      onClick={onUpdateImageTrigger}
                      className="text-sm font-bold text-primary hover:underline cursor-pointer"
                    >
                      Update Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-sm font-bold text-destructive hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-medium text-gray-700">Full Name</Label>
                  <div className="relative">
                    <Input
                      {...registerInfo("name")}
                      placeholder="Enter full name"
                      className={cn(
                        "h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-normal",
                        infoErrors.name && "ring-2 ring-destructive"
                      )}
                    />
                    {infoErrors.name && (
                      <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {infoErrors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Input
                      {...registerInfo("email")}
                      disabled
                      className={cn(
                        "h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-normal opacity-70 cursor-not-allowed"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-medium text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Input
                      {...registerInfo("phone")}
                      placeholder="Enter phone number"
                      className={cn(
                        "h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-normal",
                        infoErrors.phone && "ring-2 ring-destructive"
                      )}
                    />
                    {infoErrors.phone && (
                      <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {infoErrors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-medium text-gray-700">Role</Label>
                  <div className="relative">
                    <Input
                      {...registerInfo("role")}
                      disabled
                      className={cn(
                        "h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-normal opacity-70 cursor-not-allowed"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-primary text-white font-medium py-3 px-10 cursor-pointer rounded-xl hover:bg-primary/90 transition-all shadow-none disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </form>

      {/* Security Section Form */}
      <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none bg-white rounded-2xl shadow-none overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-50 pb-6 font-medium">Change Password</h2>

              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-medium text-gray-700">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword.current ? "text" : "password"}
                      {...registerPassword("currentPassword")}
                      placeholder="Enter your current password here..."
                      className={cn(
                        "h-12 bg-[#F5F6FF]/50 border-none rounded-xl pl-6 pr-12 focus-visible:ring-primary shadow-none text-gray-700 font-normal",
                        passwordErrors.currentPassword && "ring-2 ring-destructive"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2.5">
                    <Label className="text-[15px] font-medium text-gray-700">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword.new ? "text" : "password"}
                        {...registerPassword("newPassword")}
                        placeholder="Enter your new password here..."
                        className={cn(
                          "h-12 bg-[#F5F6FF]/50 border-none rounded-xl pl-6 pr-12 focus-visible:ring-primary shadow-none text-gray-700 font-normal",
                          passwordErrors.newPassword && "ring-2 ring-destructive"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      {passwordErrors.newPassword && (
                        <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[15px] font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        {...registerPassword("confirmPassword")}
                        placeholder="Enter your confirm password here..."
                        className={cn(
                          "h-12 bg-[#F5F6FF]/50 border-none rounded-xl pl-6 pr-12 focus-visible:ring-primary shadow-none text-gray-700 font-normal",
                          passwordErrors.confirmPassword && "ring-2 ring-destructive"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      {passwordErrors.confirmPassword && (
                        <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-primary text-white font-medium py-3 px-10 cursor-pointer rounded-xl hover:bg-primary/90 transition-all shadow-none disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isChangingPassword ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </div>
  );
}
