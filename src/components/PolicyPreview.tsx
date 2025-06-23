import { FormData } from "@/types";
import { templates } from "@/lib/templates";

type Props = {
  formData: FormData;
  activePolicyKey: string;
};

function isValidPolicyKey(key: string): key is keyof typeof templates {
  return key in templates;
}

const replacer = (text: string, companyInfo: FormData['companyInfo']): string => {
  return text
    .replace(/{{COMPANY_NAME}}/g, companyInfo?.companyName || "Your Company")
    .replace(/{{WEBSITE_URL}}/g, companyInfo?.websiteUrl || "yourwebsite.com")
    .replace(/{{CONTACT_EMAIL}}/g, companyInfo?.contactEmail || "contact@yourwebsite.com")
    .replace(/{{ADDRESS}}/g, companyInfo?.address || "Your Company Address")
    .replace(/{{COUNTRY}}/g, companyInfo?.country || "Your Country");
};

const generatePreviewHtml = (
  policyKey: string,
  formData: FormData
): string => {
  if (isValidPolicyKey(policyKey)) {
    const template = templates[policyKey];
    const base = replacer(template.base, formData.companyInfo);
    let policyText = `<h1>${template.name}</h1><p>${base.replace(
      /\n/g,
      "<br>"
    )}</p>`;
    const selectedClauses = formData.customizations[policyKey] || [];
    selectedClauses.forEach((clauseId) => {
      const clause = template.clauses.find((c) => c.id === clauseId);
      if (clause) {
        const clauseText = replacer(clause.text, formData.companyInfo);
        policyText += `<p>${clauseText.replace(/\n/g, "<br>")}</p>`;
      }
    });
    return policyText;
  }
  return "<p>Select a policy to see a preview.</p>";
};

const PolicyPreview = ({ formData, activePolicyKey }: Props) => {
  const previewHtml = generatePreviewHtml(activePolicyKey, formData);

  return (
    <div 
      className="prose prose-lg max-w-none w-full h-full bg-white rounded-md p-4" 
      style={{ fontFamily: "'Lora', serif" }}
    >
      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
    </div>
  );
};

export default PolicyPreview; 