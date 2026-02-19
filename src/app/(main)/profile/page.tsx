"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Camera } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>("https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Sarah Jenkins",
      email: "s.jenkins@carefy.portal",
      role: "Admin",
      employeeId: "CF-1092",
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("Image size must be less than 800KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const onUpdateImageTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setProfileImage("");
    toast.message("Profile photo removed");
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form Data:", data);
    toast.success("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Profile Section */}
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
                    src={profileImage}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">SJ</AvatarFallback>
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
                <p className="text-sm text-gray-400 font-medium">JPG, GIF or PNG. Max size of 800K</p>
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
                <Label className="text-[15px] font-bold text-gray-700">Full Name</Label>
                <div className="relative">
                  <Input
                    {...register("fullName")}
                    className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                      errors.fullName && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.fullName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-bold text-gray-700">Email Address</Label>
                <div className="relative">
                  <Input
                    {...register("email")}
                    className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                      errors.email && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-bold text-gray-700">Role</Label>
                <div className="relative">
                  <Input
                    {...register("role")}
                    className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                      errors.role && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.role && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-bold text-gray-700">Employee ID</Label>
                <div className="relative">
                  <Input
                    {...register("employeeId")}
                    className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                      errors.employeeId && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.employeeId && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.employeeId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-2xl shadow-none overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-50 pb-6">Change Password</h2>

            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label className="text-[15px] font-bold text-gray-700">Current Password</Label>
                <div className="relative">
                  <Input
                    type="password"
                    {...register("currentPassword")}
                    placeholder="Enter your current password here..."
                    className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                      errors.currentPassword && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-bold text-gray-700">New Password</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      {...register("newPassword")}
                      placeholder="Enter your new password here..."
                      className={cn(
                        "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                        errors.newPassword && "ring-2 ring-destructive"
                      )}
                    />
                    {errors.newPassword && (
                      <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.newPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[15px] font-bold text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Enter your confirm password here..."
                      className={cn(
                        "h-14 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus-visible:ring-primary shadow-none text-gray-700 font-medium",
                        errors.confirmPassword && "ring-2 ring-destructive"
                      )}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white font-bold py-3 px-10 cursor-pointer rounded-xl hover:bg-primary/90 transition-all"
              >
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </form>
  );
}
