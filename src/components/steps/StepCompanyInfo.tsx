import { Dispatch, SetStateAction } from "react";
import { FormData } from "@/types";

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

export default function StepCompanyInfo({
  nextStep,
  prevStep,
  formData,
  setFormData,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [id]: value,
      },
    }));
  };

  const inputStyles = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm";
  const labelStyles = "block text-sm font-medium text-gray-700";

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Lora', serif" }}>
        Step 2: Tell Us About Your Business
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="companyName" className={labelStyles}>
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={formData.companyInfo?.companyName || ""}
            onChange={handleChange}
            className={inputStyles}
            placeholder="Your Company LLC"
          />
        </div>
        <div>
          <label htmlFor="websiteUrl" className={labelStyles}>
            Website/App URL
          </label>
          <input
            type="text"
            id="websiteUrl"
            value={formData.companyInfo?.websiteUrl || ""}
            onChange={handleChange}
            className={inputStyles}
            placeholder="https://yourcompany.com"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className={labelStyles}>
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            value={formData.companyInfo?.contactEmail || ""}
            onChange={handleChange}
            className={inputStyles}
            placeholder="contact@yourcompany.com"
          />
        </div>
        <div>
          <label htmlFor="address" className={labelStyles}>
            Company Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.companyInfo?.address || ""}
            onChange={handleChange}
            className={inputStyles}
            placeholder="123 Main St, Anytown, USA"
          />
        </div>
        <div>
          <label htmlFor="country" className={labelStyles}>
            Country of Operation
          </label>
          <input
            type="text"
            id="country"
            value={formData.companyInfo?.country || ""}
            onChange={handleChange}
            className={inputStyles}
            placeholder="United States"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prevStep}
          className="text-slate-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
} 