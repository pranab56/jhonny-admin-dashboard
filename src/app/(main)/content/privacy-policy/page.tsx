"use client";

import TipTapEditor from "@/TipTapEditor/TipTapEditor";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/features/cms/cmsApi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");
  const { data: apiResponse, isLoading } = useGetPrivacyPolicyQuery(undefined);

  const [updatePrivacyPolicy, { isLoading: isSaving }] = useUpdatePrivacyPolicyMutation();

  useEffect(() => {
    if (apiResponse?.data?.content) {
      setContent(apiResponse.data.content);
    }
  }, [apiResponse]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    try {
      const res = await updatePrivacyPolicy({
        title: apiResponse?.data?.title || "Privacy Policy",
        content,
      }).unwrap();

      toast.success(res?.message || "Privacy policy updated successfully!");
    } catch (err: unknown) {
      console.error("Update Privacy Policy error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to update privacy policy.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-medium text-[#1A1D2E]">Content & Configuration</h1>
        <p className="text-[#54617A] text-[15px] max-w-lg leading-relaxed">
          Manage service offerings, pricing rules, and system-wide announcements to keep the platform running smoothly.
        </p>
      </div>

      {/* Editor Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none">
          <CardContent className="p-8 space-y-8">
            <h2 className="text-xl font-bold text-[#1A1D2E] border-b border-gray-50 pb-6">
              Privacy and Policy Configuration
            </h2>

            {isLoading ? (
              <LoadingSpinner message="Loading Privacy Policy..." className="h-64 py-0" />
            ) : (
              <div className="space-y-6">
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                  minHeight="400px"
                  maxHeight="800px"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 bg-primary text-white font-bold px-10 rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Content</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}