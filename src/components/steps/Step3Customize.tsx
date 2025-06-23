import { Dispatch, SetStateAction, useState } from "react";
import { FormData } from "@/types";
import { templates } from "@/lib/templates";
import PolicyPreview from "../PolicyPreview";

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

// A type guard to check if a key is a valid policy in our templates
function isValidPolicyKey(
  key: string
): key is keyof typeof templates {
  return key in templates;
}

export default function Step3Customize({
  nextStep,
  prevStep,
  formData,
  setFormData,
}: Props) {
  const [activePolicy, setActivePolicy] = useState(formData.policies[0] || "");

  const handleCheckboxChange = (
    policy: string,
    clauseId: string,
    checked: boolean
  ) => {
    const currentCustomizations = formData.customizations[policy] || [];
    let newCustomizations: string[];

    if (checked) {
      newCustomizations = [...currentCustomizations, clauseId];
    } else {
      newCustomizations = currentCustomizations.filter((id) => id !== clauseId);
    }

    setFormData({
      ...formData,
      customizations: {
        ...formData.customizations,
        [policy]: newCustomizations,
      },
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Lora', serif" }}>
        Step 4: Customize Clauses
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {formData.policies.map((policyKey) => {
                const templateName = isValidPolicyKey(policyKey) ? templates[policyKey].name : policyKey;
                return (
                  <button
                    key={policyKey}
                    onClick={() => setActivePolicy(policyKey)}
                    className={`${
                      activePolicy === policyKey
                        ? "border-slate-500 text-slate-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm transition-colors`}
                  >
                    {templateName}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            {isValidPolicyKey(activePolicy) &&
              templates[activePolicy].clauses.map((clause) => (
                <label key={clause.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    id={`${activePolicy}-${clause.id}`}
                    type="checkbox"
                    className="focus:ring-slate-500 h-4 w-4 text-slate-600 border-gray-300 rounded mt-1"
                    checked={
                      formData.customizations[activePolicy]?.includes(clause.id) ||
                      false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        activePolicy,
                        clause.id,
                        e.target.checked
                      )
                    }
                  />
                  <span className="ml-3 block text-sm font-medium text-gray-700">
                    {clause.label}
                  </span>
                </label>
              ))}
          </div>
        </div>

        <div className="hidden lg:block bg-gray-50 p-6 rounded-lg border border-gray-200">
          <PolicyPreview formData={formData} activePolicyKey={activePolicy} />
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