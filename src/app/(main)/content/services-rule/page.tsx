"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, BriefcaseMedical, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  baseRate: z.string().min(1, "Base rate is required"),
  category: z.string().min(1, "Category is required"),
  details: z.string().min(10, "Details must be at least 10 characters"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const initialServices = [
  { id: 1, name: "Nursing Care", providerCount: "124 Caregivers", baseRate: "45.00" },
  { id: 2, name: "Therapy Services", providerCount: "86 Providers", baseRate: "65.00" },
  { id: 3, name: "Post-Op Care", providerCount: "42 Caregivers", baseRate: "55.00" },
  { id: 4, name: "Elderly Care", providerCount: "210 Caregivers", baseRate: "40.00" },
];

interface Service {
  id: number;
  name: string;
  providerCount: string;
  baseRate: string;
}

export default function ServicesRulePage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  // Reset form when modal opens/closes or selected service changes
  useEffect(() => {
    if (selectedService) {
      reset({
        name: selectedService.name,
        baseRate: selectedService.baseRate,
        category: selectedService.name.toLowerCase().includes("nursing") ? "nursing" : "therapy",
        details: "Professional in-home medical assistance provided by registered specialists.",
      });
    } else {
      reset({
        name: "",
        baseRate: "",
        category: "nursing",
        details: "",
      });
    }
  }, [selectedService, reset, isModalOpen]);

  const onAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const onEditService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const onSubmit = (data: ServiceFormValues) => {
    if (selectedService) {
      // Edit logic
      setServices(services.map(s => s.id === selectedService.id ? { ...s, ...data } : s));
      toast.success("Service updated successfully!");
    } else {
      // Add logic
      const newService = {
        id: services.length + 1,
        ...data,
        providerCount: "0 Providers",
      };
      setServices([...services, newService]);
      toast.success("New service added successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-[#1A1D2E]">Content & Configuration</h1>
          <p className="text-[#54617A] text-[15px] max-w-lg leading-relaxed">
            Manage service offerings, pricing rules, and system-wide announcements to keep the platform running smoothly.
          </p>
        </div>
        <button
          onClick={onAddService}
          className="h-11 bg-primary text-white font-medium px-8 rounded-lg hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-none"
        >
          Add New Service
        </button>
      </div>

      {/* Services Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none bg-white rounded-2xl overflow-hidden shadow-none p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-[#EBF2FA]/30 hover:bg-[#EBF2FA]/30">
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700">Services Name</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Provider Count</TableHead>
                  <TableHead className="px-6 py-6 text-[15px] font-semibold text-gray-700">Base Rate</TableHead>
                  <TableHead className="px-8 py-6 text-[15px] font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index} className="border-none hover:bg-gray-50/50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#EAF5FF] flex items-center justify-center">
                          <BriefcaseMedical className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-[15px] font-normal text-gray-800">{service.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <span className="text-[15px] font-normal text-primary">{service.providerCount}</span>
                    </TableCell>
                    <TableCell className="px-6 py-6 font-normal text-gray-600 text-[15px]">
                      ${service.baseRate}/hr
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <button
                        onClick={() => onEditService(service)}
                        className="p-2 text-[#2ECC71] hover:bg-[#E6F9F1] rounded-lg transition-all cursor-pointer"
                      >
                        <PencilLine size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shared Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px] border-none rounded-3xl p-8 bg-white shadow-2xl focus:outline-none">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-medium text-[#1A1D2E]">
              {selectedService ? "Edit Service Category" : "Add New Service Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-[15px] font-medium text-gray-700">Service Name</Label>
                <div className="relative">
                  <Input
                    {...register("name")}
                    placeholder="e.g. Nursing Care"
                    className={cn(
                      "h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none text-gray-700",
                      errors.name && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[15px] font-medium text-gray-700">Base Rate (Per Hour)</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <Input
                    {...register("baseRate")}
                    placeholder="45.00"
                    className={cn(
                      "pl-10 h-12 bg-[#F5F6FF]/50 border-none rounded-xl px-6 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none text-gray-700",
                      errors.baseRate && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.baseRate && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.baseRate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 w-full">
              <Label className="text-[15px] font-medium text-gray-700">Provider Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(
                      "h-14 bg-[#F5F6FF]/50 border-none py-6 rounded-xl w-full  px-6 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none text-gray-700 font-medium",
                      errors.category && "ring-2 ring-destructive"
                    )}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                      <SelectItem value="nursing" className="cursor-pointer">Nursing</SelectItem>
                      <SelectItem value="therapy" className="cursor-pointer">Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-destructive font-medium mt-1 pl-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-[15px] font-medium text-gray-700">Service Details</Label>
              <div className="relative">
                <Textarea
                  {...register("details")}
                  placeholder="Describe the service details..."
                  className={cn(
                    "min-h-[150px] bg-[#F5F6FF]/50 border-none rounded-2xl p-6 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none resize-none leading-relaxed text-[#54617A] font-medium",
                    errors.details && "ring-2 ring-destructive"
                  )}
                />
                {errors.details && (
                  <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.details.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-12 bg-[#EBF2FA] text-[#54617A] font-medium px-10 rounded-xl hover:bg-[#E1EAF5] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-12 bg-primary text-white font-medium px-10 rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-none"
              >
                {selectedService ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}