import { Dispatch, SetStateAction } from "react";
import { FormData } from "@/types";

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

export default function Step2Policies({
  nextStep,
  prevStep,
  formData,
  setFormData,
}: Props) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, policies: [...formData.policies, value] });
    } else {
      setFormData({
        ...formData,
        policies: formData.policies.filter((policy) => policy !== value),
      });
    }
  };

  const isSelected = (policy: string) => formData.policies.includes(policy);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Lora', serif" }}>
        Step 3: Select the policies you want to generate
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${isSelected('privacy') ? 'bg-slate-100 border-slate-400' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            id="privacy"
            name="policy"
            type="checkbox"
            value="privacy"
            checked={isSelected('privacy')}
            onChange={handleCheckboxChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Privacy Policy
          </span>
        </label>
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${isSelected('terms') ? 'bg-slate-100 border-slate-400' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            id="terms"
            name="policy"
            type="checkbox"
            value="terms"
            checked={isSelected('terms')}
            onChange={handleCheckboxChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Terms & Conditions
          </span>
        </label>
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${isSelected('shipping') ? 'bg-slate-100 border-slate-400' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            id="shipping"
            name="policy"
            type="checkbox"
            value="shipping"
            checked={isSelected('shipping')}
            onChange={handleCheckboxChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Return & Shipping Policy
          </span>
        </label>
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${isSelected('cookie') ? 'bg-slate-100 border-slate-400' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            id="cookie"
            name="policy"
            type="checkbox"
            value="cookie"
            checked={isSelected('cookie')}
            onChange={handleCheckboxChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Cookie Policy
          </span>
        </label>
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${isSelected('dispute') ? 'bg-slate-100 border-slate-400' : 'border-gray-200 hover:bg-gray-50'}`}>
          <input
            id="dispute"
            name="policy"
            type="checkbox"
            value="dispute"
            checked={isSelected('dispute')}
            onChange={handleCheckboxChange}
            className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded"
          />
          <span className="ml-3 block text-md font-medium text-gray-800">
            Dispute Resolution Policy
          </span>
        </label>
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
          disabled={formData.policies.length === 0}
          className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
} 