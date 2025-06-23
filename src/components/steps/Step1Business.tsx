import { Dispatch, SetStateAction } from "react";
import { FormData } from "@/types";

type Props = {
  nextStep: () => void;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

export default function Step1Business({
  nextStep,
  formData,
  setFormData,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, businessType: e.target.value });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Lora', serif" }}>
        Step 1: What type of business do you have?
      </h2>
      <div className="space-y-4">
        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            id="ecommerce"
            name="businessType"
            type="radio"
            value="ecommerce"
            checked={formData.businessType === "ecommerce"}
            onChange={handleChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            eCommerce Store
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            id="saas"
            name="businessType"
            type="radio"
            value="saas"
            checked={formData.businessType === "saas"}
            onChange={handleChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            SaaS (Software as a Service)
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            id="app"
            name="businessType"
            type="radio"
            value="app"
            checked={formData.businessType === "app"}
            onChange={handleChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            App Developer
          </span>
        </label>
        <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            id="other"
            name="businessType"
            type="radio"
            value="other"
            checked={formData.businessType === "other"}
            onChange={handleChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Other
          </span>
        </label>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={nextStep}
          disabled={!formData.businessType}
          className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
} 