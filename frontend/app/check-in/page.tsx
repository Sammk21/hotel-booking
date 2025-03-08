"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Plus, Trash2 } from "lucide-react";
import { checkInBooking } from "@/actions/allActions";

// Import the server action for check-in


export default function CheckInPage() {
  const [bookingReference, setBookingReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [familyMembers, setFamilyMembers] = useState([
    { name: "", aadhaar: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", aadhaar: "" }]);
  };

  const removeFamilyMember = (index: number) => {
    const updatedMembers = [...familyMembers];
    updatedMembers.splice(index, 1);
    setFamilyMembers(updatedMembers);
  };

  const updateFamilyMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFamilyMembers(updatedMembers);

    // Clear error for this field if it exists
    if (errors[`familyMember${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`familyMember${index}_${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingReference.trim()) {
      newErrors.bookingReference = "Booking reference is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    familyMembers.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`familyMember${index}_name`] = "Name is required";
      }

      if (!member.aadhaar.trim()) {
        newErrors[`familyMember${index}_aadhaar`] =
          "Aadhaar number is required";
      } else if (!/^\d{12}$/.test(member.aadhaar)) {
        newErrors[`familyMember${index}_aadhaar`] = "Aadhaar must be 12 digits";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the first family member's Aadhaar number for check-in
      const primaryAadhaar = familyMembers[0].aadhaar;
       const token = localStorage.getItem("authToken"); // Replace with secure auth handling

       if (!token) {
         alert("Please login ");
         return;
       }
      await checkInBooking(bookingReference, primaryAadhaar, token);
      setIsSuccess(true);
    } catch (error: any) {
      // Display any API error as a form error
      setErrors({ ...errors, form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="bg-background border border-border p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-serif mb-2">Check-in Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your web check-in has been completed successfully. You can now
              proceed directly to your room upon arrival.
            </p>

            <div className="bg-muted/30 p-6 mb-6 text-left">
              <h2 className="font-medium mb-4">Check-in Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Booking Reference
                  </span>
                  <span className="font-medium">{bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Name
                  </span>
                  <span>{lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Number of Guests
                  </span>
                  <span>{familyMembers.length}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2">Web Check-in</h1>
          <p className="text-muted-foreground">
            Complete your check-in online to enjoy a seamless arrival experience
          </p>
        </div>

        <div className="bg-background border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <p className="text-destructive text-center">{errors.form}</p>
            )}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Booking Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-reference">Booking Reference</Label>
                  <Input
                    id="booking-reference"
                    placeholder="Enter booking reference"
                    value={bookingReference}
                    onChange={(e) => {
                      setBookingReference(e.target.value);
                      if (errors.bookingReference) {
                        const newErrors = { ...errors };
                        delete newErrors.bookingReference;
                        setErrors(newErrors);
                      }
                    }}
                    className={`rounded-none ${
                      errors.bookingReference ? "border-destructive" : ""
                    }`}
                  />
                  {errors.bookingReference && (
                    <p className="text-destructive text-sm">
                      {errors.bookingReference}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) {
                        const newErrors = { ...errors };
                        delete newErrors.lastName;
                        setErrors(newErrors);
                      }
                    }}
                    className={`rounded-none ${
                      errors.lastName ? "border-destructive" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Guest Information</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFamilyMember}
                  className="rounded-none"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Guest
                </Button>
              </div>

              <div className="space-y-6">
                {familyMembers.map((member, index) => (
                  <div key={index} className="p-4 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Guest {index + 1}</h3>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFamilyMember(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Full Name</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={member.name}
                          onChange={(e) =>
                            updateFamilyMember(index, "name", e.target.value)
                          }
                          className={`rounded-none ${
                            errors[`familyMember${index}_name`]
                              ? "border-destructive"
                              : ""
                          }`}
                        />
                        {errors[`familyMember${index}_name`] && (
                          <p className="text-destructive text-sm">
                            {errors[`familyMember${index}_name`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`aadhaar-${index}`}>
                          Aadhaar Number
                        </Label>
                        <Input
                          id={`aadhaar-${index}`}
                          placeholder="12-digit Aadhaar number"
                          value={member.aadhaar}
                          onChange={(e) =>
                            updateFamilyMember(
                              index,
                              "aadhaar",
                              e.target.value.replace(/\D/g, "").slice(0, 12)
                            )
                          }
                          className={`rounded-none ${
                            errors[`familyMember${index}_aadhaar`]
                              ? "border-destructive"
                              : ""
                          }`}
                        />
                        {errors[`familyMember${index}_aadhaar`] && (
                          <p className="text-destructive text-sm">
                            {errors[`familyMember${index}_aadhaar`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that all information provided is accurate and complete
              </label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-none"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Check-in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
