"use client";

import TipTapEditor from "@/TipTapEditor/TipTapEditor";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("<p>Manage your platform's privacy policy here. Use the rich text editor to format your policy correctly.</p>");

  const handleSave = () => {
    toast.success("Privacy policy saved successfully!");
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
            <h2 className="text-xl font-bold text-[#1A1D2E] border-b border-gray-50 pb-6">Privacy and Policy Configuration</h2>

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
                  className="h-14 bg-primary text-white font-bold px-10 rounded-xl hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Save Content
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}