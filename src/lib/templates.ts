export const templates = {
  privacy: {
    name: "Privacy Policy",
    base: `This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

This document is for {{COMPANY_NAME}}.`,
    clauses: [
      {
        id: "data-collection",
        label: "Do you collect user data? (e.g., name, email, address)",
        text: "We collect personal information that you voluntarily provide to us when you register on the app, express an interest in obtaining information about us or our products and services, when you participate in activities on {{WEBSITE_URL}} or otherwise when you contact us.\n\n",
      },
      {
        id: "data-use",
        label: "How do you use the collected data?",
        text: "We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
      },
      {
        id: "tracking-tech",
        label: "Do you use cookies and other tracking technologies?",
        text: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.",
      },
      {
        id: "data-retention",
        label: "How long do you keep user data?",
        text: "We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).",
      },
      {
        id: "app-store",
        label: "Is your app available on the Apple App Store?",
        text: "Our application is compliant with the Apple App Store's privacy requirements. We are committed to protecting your data and ensuring transparency in how we handle it.\n\n",
      },
      {
        id: "google-play",
        label: "Is your app available on the Google Play Store?",
        text: "Our application is compliant with the Google Play Store's privacy requirements. We provide users with clear information about the data we collect and how it is used.\n\n",
      },
      {
        id: "payment-gateways",
        label: "Do you use third-party services to process payments?",
        text: "We use third-party services for payment processing (e.g., payment processors). We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy.\n\n",
      },
      {
        id: "gdpr",
        label: "Do you require GDPR compliance?",
        text: "If you are a resident of the European Economic Area (EEA), you have certain data protection rights. For any questions, you can contact us at {{CONTACT_EMAIL}}.\n\n",
      },
    ],
  },
  terms: {
    name: "Terms & Conditions",
    base: `Welcome to {{COMPANY_NAME}}! These terms and conditions outline the rules and regulations for the use of our website, located at {{WEBSITE_URL}}. By accessing this website we assume you accept these terms and conditions.`,
    clauses: [
      {
        id: "accounts",
        label: "Do users need to create an account?",
        text: "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.",
      },
      {
        id: "termination",
        label: "Do you need a termination clause?",
        text: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
      },
      {
        id: "governing-law",
        label: "Do you need to specify a governing law?",
        text: `These Terms shall be governed and construed in accordance with the laws of {{COUNTRY}}, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
      },
    ],
  },
  shipping: {
    name: "Return & Shipping Policy",
    base: `Thank you for shopping at {{COMPANY_NAME}}. If you are not entirely satisfied with your purchase, we're here to help.`,
    clauses: [
      {
        id: "returns",
        label: "Do you accept returns?",
        text: "You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.",
      },
      {
        id: "refunds",
        label: "Do you offer refunds?",
        text: "Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your original method of payment.",
      },
      {
        id: "shipping-costs",
        label: "Are customers responsible for return shipping costs?",
        text: "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.",
      },
      {
        id: "contact-us",
        label: "Do you want to add a contact section for returns?",
        text: `If you have any questions on how to return your item to us, contact us at {{CONTACT_EMAIL}} or mail us at: {{ADDRESS}}.`,
      },
    ],
  },
  cookie: {
    name: "Cookie Policy",
    base: `This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies and how that information is used. For further information on how we use, store and keep your personal data secure, see our Privacy Policy.`,
    clauses: [
      {
        id: "what-are-cookies",
        label: "Include a section explaining what cookies are?",
        text: "Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.",
      },
      {
        id: "how-we-use",
        label: "Explain how you use cookies?",
        text: "We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.",
      },
      {
        id: "disabling-cookies",
        label: "Include instructions on how to disable cookies?",
        text: "You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.",
      },
      {
        id: "third-party",
        label: "Do you use any third-party cookies (e.g., Google Analytics)?",
        text: "In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site. This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.",
      },
    ],
  },
  // Other policies like 'return', etc., will be added here.
  aup: {
    name: "Acceptable Use Policy",
    base: `This Acceptable Use Policy ("AUP") details the acceptable use of {{COMPANY_NAME}}'s Service. By using our Service, you agree to this AUP.`,
    clauses: [
      {
        id: "prohibited-activities",
        label: "Do you want to include a clause on prohibited activities?",
        text: "You are prohibited from using the Service to engage in illegal activities, transmit spam, or harass other users.",
      },
      {
        id: "content-standards",
        label: "Do you want to add content standards for user-posted content?",
        text: "Content posted by users must not be obscene, defamatory, or infringing on intellectual property rights. We reserve the right to remove any content that violates these standards.",
      },
      {
        id: "enforcement",
        label: "Do you want a clause on policy enforcement?",
        text: "Violation of this AUP may result in a warning, suspension, or termination of your account, at our sole discretion.",
      },
    ],
  },
  dmca: {
    name: "DMCA Takedown Policy",
    base: `{{COMPANY_NAME}} responds to copyright infringement claims in accordance with the Digital Millennium Copyright Act (DMCA).`,
    clauses: [
      {
        id: "reporting-infringement",
        label: "Include instructions for reporting copyright infringement?",
        text: "To report a copyright infringement, please send a DMCA notice to our designated agent at {{CONTACT_EMAIL}} with all required information.",
      },
      {
        id: "counter-notification",
        label: "Include instructions for filing a counter-notification?",
        text: "If your content was removed due to a mistake or misidentification, you may file a counter-notification by providing a detailed explanation to our designated agent.",
      },
      {
        id: "repeat-infringers",
        label: "Do you want a policy for repeat infringers?",
        text: "We will terminate the accounts of users who are determined to be repeat infringers of copyright.",
      },
    ],
  },
}; 