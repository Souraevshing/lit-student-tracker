"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  CalendarIcon,
  Download,
  ExternalLink,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  accountFormSchema,
  type AccountFormValues,
} from "@/lib/utils/account-form.schema";
import { fileToBase64, generateFallbackPDF } from "@/lib/utils/image-utils";
import { IdCard } from "./id-card";
import { Sidebar } from "./sidebar";

export function Account() {
  const [showIdCard, setShowIdCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    "/thoughtful-gaze.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AccountFormValues) => {
    setIsSubmitting(true);
    try {
      data.profileImage = profileImage;

      // Simulate a delay for the submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated");

      setShowIdCard(true);
    } catch (error) {
      if (error instanceof Error)
        toast.error(
          error.message || "Failed to update profile. Please try again"
        );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      const base64 = await fileToBase64(file);
      setProfileImage(base64);

      form.setValue("profileImage", base64);

      toast.success("Image uploaded");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadIdCardAsPDF = async () => {
    const idCardElement = document.getElementById("id-card-front");
    const idCardBackElement = document.getElementById("id-card-back");

    if (!idCardElement || !idCardBackElement) return;

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a6",
        precision: 100,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const frontCanvas = await html2canvas(idCardElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1f1f1f",
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const images = clonedDoc.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
              images[i].crossOrigin = "anonymous";
            }
          },
        });

        const frontImgData = frontCanvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(
          frontImgData,
          "JPEG",
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );

        pdf.addPage();

        const backCanvas = await html2canvas(idCardBackElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1f1f1f",
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const images = clonedDoc.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
              images[i].crossOrigin = "anonymous";
            }
          },
        });

        const backImgData = backCanvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(
          backImgData,
          "JPEG",
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );
      } catch (canvasError) {
        console.error("Canvas error, using fallback:", canvasError);
        const fallbackPdf = generateFallbackPDF({
          ...form.getValues(),
          profileImage,
        });
        if (fallbackPdf) {
          const resolvedFallbackPdf = await fallbackPdf;
          resolvedFallbackPdf.save("LIT-ID-Card.pdf");

          toast.success("ID Card Downloaded");
          return;
        } else {
          toast.error("Failed to generate PDF using fallback method");
          throw new Error("Both PDF generation methods failed");
        }
      }

      pdf.save("LIT-ID-Card.pdf");

      toast.success("ID Card Downloaded");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Download Failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-800 border-zinc-700"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-800 border-zinc-700"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="hover:bg-zinc-700"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="hover:bg-zinc-700"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="hover:bg-zinc-700"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="text-zinc-400 hover:text-white relative">
              <span className="sr-only">Notifications</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={profileImage || "/placeholder.svg"}
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-zinc-900 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-sm mb-4">
              Account Details
            </div>
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={profileImage || "/placeholder.svg"}
                  alt="John Doe"
                  className="object-cover"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {form.watch("fullName") || "John Doe"}
                </h1>
                <p className="text-zinc-400">
                  {form.watch("institute") || "LIT School"}
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm">
              Maintain all your profile information along with your passwords.
            </p>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Photo Upload Section */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-zinc-700 mb-4 overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={profileImage || "/placeholder.svg"}
                          alt="John Doe"
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl">JD</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-zinc-400 text-center mb-2">
                      Upload a Passport size image of yourself. Ensure that your
                      face covers 60% of this picture.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                      onClick={triggerFileInput}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter name"
                              className="bg-zinc-700 border-zinc-600 focus:border-violet-500"
                            />
                          </FormControl>
                          <div className="flex justify-end">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter email"
                              className="bg-zinc-700 border-zinc-600 focus:border-violet-500"
                            />
                          </FormControl>
                          <div className="flex justify-end">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Contact No. */}
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Contact No.
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter phone"
                              className="bg-zinc-700 border-zinc-600 focus:border-violet-500"
                            />
                          </FormControl>
                          <div className="flex justify-end">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Institute Name */}
                    <FormField
                      control={form.control}
                      name="institute"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Institute Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter institute"
                              className="bg-zinc-700 border-zinc-600 focus:border-violet-500"
                            />
                          </FormControl>
                          <div className="flex justify-end">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Date of Birth
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-zinc-700 border-zinc-600 hover:bg-zinc-600",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-zinc-800 border-zinc-700"
                              align="start"
                            >
                              <Calendar
                                captionLayout="dropdown"
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                                className="bg-zinc-800 text-white"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-700 border-zinc-600 focus:ring-violet-500 focus:border-violet-500">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-700 border-zinc-600">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Blood Group */}
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Blood Group
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-700 border-zinc-600 focus:ring-violet-500 focus:border-violet-500">
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-700 border-zinc-600">
                              <SelectItem value="o_positive">O+</SelectItem>
                              <SelectItem value="o_negative">O-</SelectItem>
                              <SelectItem value="a_positive">A+</SelectItem>
                              <SelectItem value="a_negative">A-</SelectItem>
                              <SelectItem value="b_positive">B+</SelectItem>
                              <SelectItem value="b_negative">B-</SelectItem>
                              <SelectItem value="ab_positive">AB+</SelectItem>
                              <SelectItem value="ab_negative">AB-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* LinkedIn ID */}
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            LinkedIn ID
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter linkedin id"
                                className="bg-zinc-700 border-zinc-600 focus:border-violet-500 pr-8"
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Instagram ID */}
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-zinc-400">
                            Your Instagram ID (Not Compulsory)
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter instagram id"
                                className="bg-zinc-700 border-zinc-600 focus:border-violet-500 pr-8"
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons - Moved to the left */}
                <div className="mt-8 flex justify-start gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {/* ID Card Section */}
          <div className="mt-6 bg-zinc-800 rounded-lg p-4 flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="bg-red-500 p-2 rounded-md">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 7H7V9H9V7Z" fill="white" />
                  <path d="M9 11H7V13H9V11Z" fill="white" />
                  <path d="M9 15H7V17H9V15Z" fill="white" />
                  <path d="M13 7H17V9H13V7Z" fill="white" />
                  <path d="M13 11H17V13H13V11Z" fill="white" />
                  <path d="M13 15H17V17H13V15Z" fill="white" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">LIT ID Card</h3>
              <p className="text-sm text-zinc-400">
                Carry your identity as a creator, innovator, and learner
                wherever you go.
              </p>
            </div>
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => setShowIdCard(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      {showIdCard && (
        <IdCard
          onClose={() => setShowIdCard(false)}
          userData={{ ...form.getValues(), profileImage }}
          onDownload={downloadIdCardAsPDF}
        />
      )}
    </div>
  );
}
