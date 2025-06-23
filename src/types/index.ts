export interface FormData {
  businessType: string;
  policies: string[];
  customizations: {
    [key: string]: string[];
  };
  companyInfo: {
    companyName?: string;
    websiteUrl?: string;
    contactEmail?: string;
    address?: string;
    country?: string;
  };
  agreedToTerms?: boolean;
} 