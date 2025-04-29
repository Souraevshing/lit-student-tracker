"use client";

import { Download, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AccountFormValues } from "@/lib/utils/account-form.schema";

interface IdCardProps {
  onClose: () => void;
  userData: AccountFormValues;
  onDownload: () => void;
}

export function IdCard({ onClose, userData, onDownload }: IdCardProps) {
  const formatDate = (date: string) => {
    try {
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    } catch (e) {
      console.log(e);
      return date;
    }
  };

  const currentDate = new Date();
  const issueDate = formatDate(currentDate.toISOString());
  const expiryDate = formatDate(
    new Date(
      currentDate.setFullYear(currentDate.getFullYear() + 1)
    ).toISOString()
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-zinc-900 border-zinc-800">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* ID Card Design - Front */}
              <div
                id="id-card-front"
                className="flex-1 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700"
              >
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                  <div className="font-bold text-xl">LIT</div>
                  <div className="text-xs">LITCM085</div>
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-zinc-700 rounded-md overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src="/thoughtful-gaze.png"
                          alt={userData.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xl">
                          {userData.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{userData.fullName}</h3>
                      <p className="text-sm text-zinc-400">
                        {userData.institute} CM04320
                      </p>
                      <p className="text-sm mt-2">{userData.email}</p>
                      <p className="text-sm">{userData.contact}</p>

                      <div className="mt-4 text-xs text-zinc-400">
                        <p className="flex justify-between">
                          <span>Father&apos;s Name:</span>
                          <span>John Doe Sr.</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Emergency Contact:</span>
                          <span>9414071012</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Blood Group:</span>
                          <span>{userData.bloodGroup.replace("_", "")}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs">
                    <p className="text-zinc-400">
                      <span className="font-medium">Address:</span> 123 Main
                      Street, City, State, 302016
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-zinc-400">
                    <p>Issued On: {issueDate}</p>
                    <p>Expiry Date: {expiryDate}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
                    <p className="text-xs text-zinc-400">
                      The LIT School Learn * Innovate * Transform
                    </p>
                    <p className="text-xs text-zinc-400">
                      www.litschool.in info@litschool.in
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden ID Card Back for PDF generation */}
              <div id="id-card-back" className="hidden">
                <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 p-4">
                  <div className="border-b border-zinc-700 pb-4 mb-4">
                    <h3 className="font-bold text-center mb-2">
                      TERMS AND CONDITIONS
                    </h3>
                    <ol className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
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
                    <div className="text-xs text-zinc-400 space-y-1">
                      <p>Campus Security: +91 98765 43210</p>
                      <p>Medical Emergency: +91 98765 12345</p>
                      <p>Administration: +91 98765 67890</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-zinc-400">
                      <p>Card ID: LITCM085</p>
                      <p>Student ID: CM04320</p>
                    </div>
                    <div className="w-20 h-20 bg-zinc-700 flex items-center justify-center">
                      {/* QR Code placeholder */}
                      <div className="text-xs text-center">QR Code</div>
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

                <Button
                  className="mt-auto bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4" />
                  Download as PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
