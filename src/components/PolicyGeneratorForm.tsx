"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import Step1Business from "./steps/Step1Business";
import StepCompanyInfo from "./steps/StepCompanyInfo";
import Step2Policies from "./steps/Step2Policies";
import Step3Customize from "./steps/Step3Customize";
import StepDisclaimer from "./steps/StepDisclaimer";
import Step4Review from "./steps/Step4Review";
import { FormData } from "@/types";

export default function PolicyGeneratorForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    policies: [],
    customizations: {},
    companyInfo: {
      companyName: "",
      websiteUrl: "",
      contactEmail: "",
      address: "",
      country: "",
    },
    agreedToTerms: false,
  });

  const nextStep = () => setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Business
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StepCompanyInfo
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <Step2Policies
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <Step3Customize
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <StepDisclaimer
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 6:
        return <Step4Review prevStep={prevStep} formData={formData} />;
      default:
        return (
          <Step1Business
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <ProgressBar currentStep={step} totalSteps={totalSteps} />
      <div className="p-8">
        {renderStep()}
      </div>
    </div>
  );
} 