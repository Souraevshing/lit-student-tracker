"use client";

import { Download, QrCode, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AccountFormValues } from "@/lib/utils/account-form.schema";

interface IdCardProps {
  onClose: () => void;
  userData: AccountFormValues;
  onDownload: () => Promise<void>;
  isDownloading?: boolean;
}

export function IdCard({
  onClose,
  userData,
  onDownload,
  isDownloading = false,
}: IdCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date | string) => {
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return typeof date === "string" ? date : "Invalid Date";
    }
  };

  const currentDate = new Date();
  const issueDate = formatDate(currentDate);
  const expiryDate = formatDate(
    new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
  );

  const studentId = `LIT${userData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      await onDownload();
    } catch (error) {
      console.error("Download error:", error);
      toast("Download failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white border border-gray-900 dark:bg-zinc-200">
        <div className="relative perspective-normal w-full h-[350px]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 text-white bg-zinc-800 dark:bg-zinc-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* ID Card Design - Front */}
              <div
                id="id-card-front"
                className="flex-1 bg-zinc-800 dark:bg-zinc-300 rounded-lg overflow-hidden border border-zinc-700"
                style={{ width: "300px", maxWidth: "100%" }}
              >
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                  <div className="font-bold text-xl">LIT</div>
                  <div className="text-xs">{studentId}</div>
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-zinc-700 rounded-md overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={userData.profileImage || "/thoughtful-gaze.png"}
                          alt={userData.fullName}
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                        <AvatarFallback className="text-xl h-full w-full bg-zinc-600 dark:bg-gray-200">
                          {userData.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{userData.fullName}</h3>
                      <p className="text-sm dark:text-zinc-800 text-zinc-200">
                        {userData.institute} • {studentId.substring(3, 7)}
                      </p>
                      <p className="text-sm mt-2">{userData.email}</p>
                      <p className="text-sm">{userData.contact}</p>

                      <div className="mt-4 text-xs dark:text-zinc-800 text-zinc-300">
                        <p className="flex justify-between">
                          <span>Date of Birth:</span>
                          <span>{formatDate(userData.dob)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Gender:</span>
                          <span>
                            {userData.gender.charAt(0).toUpperCase() +
                              userData.gender.slice(1)}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span>Blood Group:</span>
                          <span>
                            {userData.bloodGroup.replace("_", "").toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs">
                    <p className="dark:text-zinc-300 text-zinc-600">
                      <span className="font-medium">Address:</span> 123 Main
                      Street, City, State, 302016
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between text-xs dark:text-zinc-400 text-zinc-800">
                    <p>Issued On: {issueDate}</p>
                    <p>Expiry Date: {expiryDate}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800 dark:border-zinc-300 text-center">
                    <p className="text-xs dark:text-zinc-400 text-zinc-800">
                      The LIT School Learn * Innovate * Transform
                    </p>
                    <p className="text-xs text-zinc-400">
                      www.litschool.in • info@litschool.in
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden ID Card Back for PDF generation */}
              <div
                id="id-card-back"
                className="absolute left-[-9999px] top-0"
                style={{ width: "300px", height: "auto", overflow: "hidden" }}
              >
                <div className="bg-zinc-800 dark:bg-zinc-300 rounded-lg overflow-hidden border border-zinc-700 p-4">
                  <div className="border-b border-zinc-700 pb-4 mb-4">
                    <h3 className="font-bold text-center mb-2">
                      TERMS AND CONDITIONS
                    </h3>
                    <ol
                      className="text-xs dark:text-zinc-400 text-zinc-800
                    space-y-2 list-decimal pl-4"
                    >
                      <li>
                        This card is the property of LIT School and must be
                        returned upon request.
                      </li>
                      <li>
                        If found, please return to LIT School or the nearest
                        police station.
                      </li>
                      <li>
                        This card is non-transferable and must be carried at all
                        times within campus.
                      </li>
                      <li>
                        Loss of card should be reported immediately to the
                        administration.
                      </li>
                      <li>Replacement fee for lost card is ₹500.</li>
                    </ol>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">
                      Emergency Contacts:
                    </h4>
                    <div className="text-xs dark:text-zinc-800 text-zinc-300 space-y-1">
                      <p>Campus Security: +91 98765 43210</p>
                      <p>Medical Emergency: +91 98765 12345</p>
                      <p>Administration: +91 98765 67890</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs dark:text-zinc-800 text-zinc-300">
                      <p>Card ID: {studentId}</p>
                      <p>Student ID: {studentId.substring(3, 7)}</p>
                      <p>
                        Social:{" "}
                        {userData.linkedin
                          ? `LinkedIn: ${userData.linkedin}`
                          : ""}
                        {userData.instagram
                          ? ` • Instagram: ${userData.instagram}`
                          : ""}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-zinc-700 dark:bg-zinc-300 flex items-center justify-center">
                      <QrCode className="h-12 w-12 dark:text-zinc-400 text-zinc-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-4">LIT ID Card</h2>
                <p className="text-sm text-zinc-400 mb-6">
                  Carry your identity as a creator, innovator, and learner
                  wherever you go.
                </p>

                <div className="mt-auto space-y-3">
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
                    onClick={handleDownload}
                    disabled={isGenerating || isDownloading}
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating || isDownloading
                      ? "Generating PDF..."
                      : "Download as PDF"}
                  </Button>

                  <div className="text-xs dark:text-zinc-400 text-zinc-800">
                    <p>• Card ID: {studentId}</p>
                    <p>• Valid until: {expiryDate}</p>
                    <p>• Contains your personal and academic information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
