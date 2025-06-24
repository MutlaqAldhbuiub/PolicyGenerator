"use client";

import { FormData } from "@/types";
import { templates } from "@/lib/templates";
import { useEffect, useState, useRef } from "react";
import JSZip from "jszip";
import jsPDF from "jspdf";
import TurndownService from "turndown";
import html2canvas from "html2canvas";

// Lexical Core
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import {
  LexicalEditor,
  $getRoot,
  $insertNodes,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $isElementNode,
  EditorState,
} from "lexical";

// Lexical Plugins
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

// Lexical Nodes
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

// Lexical Utils
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $isHeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";

// --- Types and Constants ---

type Props = {
  prevStep: () => void;
  formData: FormData;
};

type ExportFormat = "txt" | "html" | "pdf" | "md";
type ExportScope = "combined" | "separate";

const editorTheme = {
  ltr: "text-left",
  rtl: "text-right",
  paragraph: "prose",
  h1: "text-3xl font-bold mb-4 font-lora",
  h2: "text-2xl font-bold mb-3 font-lora",
  h3: "text-xl font-bold mb-2 font-lora",
  list: {
    nested: {
      listitem: "ml-8",
    },
    ol: "list-decimal ml-6 prose",
    ul: "list-disc ml-6 prose",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-200 px-1 rounded-sm text-sm",
  },
  link: "text-blue-500 hover:underline",
};

const editorConfig = {
  namespace: "PolicyGeneratorEditor",
  nodes: [
    HeadingNode,
    QuoteNode,
    ListItemNode,
    ListNode,
    CodeHighlightNode,
    CodeNode,
    AutoLinkNode,
    LinkNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: editorTheme,
};

// --- Helper Functions ---

function isValidPolicyKey(key: string): key is keyof typeof templates {
  return key in templates;
}

const replacer = (
  text: string,
  companyInfo: FormData["companyInfo"]
): string => {
  return text
    .replace(/{{COMPANY_NAME}}/g, companyInfo?.companyName || "Your Company")
    .replace(/{{WEBSITE_URL}}/g, companyInfo?.websiteUrl || "yourwebsite.com")
    .replace(
      /{{CONTACT_EMAIL}}/g,
      companyInfo?.contactEmail || "contact@yourwebsite.com"
    )
    .replace(/{{ADDRESS}}/g, companyInfo?.address || "Your Company Address")
    .replace(/{{COUNTRY}}/g, companyInfo?.country || "Your Country");
};

// Generates HTML for a SINGLE policy
const generateSinglePolicyHtml = (
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
  return "";
};

// Generate initial HTML for the editor (combined view)
const generateCombinedPolicyHtml = (formData: FormData): string => {
  let fullText = "";
  formData.policies.forEach((policyKey) => {
    fullText += generateSinglePolicyHtml(policyKey, formData);
    if (fullText) fullText += "<hr>";
  });
  return fullText;
};

// --- Components ---

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    return editor.registerUpdateListener((listener) => {
      listener.editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Text format states
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));

          // Block type states
          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : $findMatchingParent(anchorNode, (e) => {
                  const parent = e.getParent();
                  return (
                    parent !== null &&
                    $isElementNode(parent) &&
                    !parent.isInline()
                  );
                });

          if (element) {
            if ($isListNode(element)) {
              const listNode = element as ListNode;
              setBlockType(listNode.getListType());
            } else if ($isHeadingNode(element)) {
              setBlockType(element.getTag());
            } else {
              setBlockType("paragraph");
            }
          }
        }
      });
    });
  }, [editor]);

  const formatHeading = (tag: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div className="flex items-center flex-wrap gap-x-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md sticky top-0 z-10">
      {/* Bold Button */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`p-2 rounded hover:bg-gray-200 ${
          isBold ? "bg-slate-200" : ""
        }`}
        aria-label="Format Bold"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
          />
        </svg>
      </button>
      {/* Italic Button */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`p-2 rounded hover:bg-gray-200 ${
          isItalic ? "bg-slate-200" : ""
        }`}
        aria-label="Format Italic"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
          />
        </svg>
      </button>
      <div className="h-5 w-px bg-gray-300 mx-2"></div>
      {/* Heading Buttons */}
      <button
        onClick={() => formatHeading("h1")}
        className={`px-3 py-1 rounded hover:bg-gray-200 text-sm font-bold ${
          blockType === "h1" ? "bg-slate-200" : ""
        }`}
      >
        H1
      </button>
      <button
        onClick={() => formatHeading("h2")}
        className={`px-3 py-1 rounded hover:bg-gray-200 text-sm font-bold ${
          blockType === "h2" ? "bg-slate-200" : ""
        }`}
      >
        H2
      </button>
      <div className="h-5 w-px bg-gray-300 mx-2"></div>
      {/* List Buttons */}
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          blockType === "bullet" ? "bg-slate-200" : ""
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          blockType === "number" ? "bg-slate-200" : ""
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
    </div>
  );
}

// Plugin to load initial HTML
function InitialHtmlPlugin({ initialHtml }: { initialHtml: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (initialHtml) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().clear();
        $getRoot().select();
        $insertNodes(nodes);
      });
    }
  }, [editor, initialHtml]);
  return null;
}

// The main editor component
function LexicalEditorComponent({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className="relative prose lg:prose-xl max-w-none"
        ref={editorRef}
        id="editor-container"
      >
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="p-4 bg-white border border-gray-300 rounded-b-md min-h-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          }
          placeholder={
            <div className="absolute top-14 left-4 text-gray-400">
              Your generated policy will appear here...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            onChange(editorState, editor);
          }}
        />
        <InitialHtmlPlugin initialHtml={initialHtml} />
      </div>
    </LexicalComposer>
  );
}

// The main review step component
export default function Step4Review({ prevStep, formData }: Props) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("html");
  const [exportScope, setExportScope] = useState<ExportScope>("combined");
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState("");

  useEffect(() => {
    setGeneratedHtml(generateCombinedPolicyHtml(formData));
  }, [formData]);

  const handleDownload = async () => {
    if (!editor) return;

    if (exportScope === "separate") {
      const zip = new JSZip();
      for (const policyKey of formData.policies) {
        const singleHtml = generateSinglePolicyHtml(policyKey, formData);
        let fileContent: string | Blob = "";
        let fileExtension = exportFormat;

        if (exportFormat === "html" || exportFormat === "txt") {
          fileContent = singleHtml;
        } else if (exportFormat === "md") {
          const turndownService = new TurndownService();
          fileContent = turndownService.turndown(singleHtml);
        }
        // PDF for separate files is more complex and might require a different approach.
        // For now, we will just create a simple text file for pdf format in separate download.
        else if (exportFormat === "pdf") {
          fileContent = `PDF export for separate policies is not fully supported yet. Content:\n\n${singleHtml}`;
          fileExtension = "txt"; // save as txt for now
        }

        zip.file(`${policyKey}.${fileExtension}`, fileContent);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "policies.zip";
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }

    // Combined download logic
    editor.getEditorState().read(async () => {
      const html = $generateHtmlFromNodes(editor, null);
      let blob: Blob;
      let filename: string;

      switch (exportFormat) {
        case "pdf": {
          const editorContainer = document.getElementById("editor-container");
          if (editorContainer) {
            const canvas = await html2canvas(editorContainer);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            blob = pdf.output("blob");
            filename = "policy.pdf";
          } else {
            console.error("Editor container not found for PDF export.");
            return;
          }
          break;
        }
        case "md": {
          const turndownService = new TurndownService();
          const markdown = turndownService.turndown(html);
          blob = new Blob([markdown], { type: "text/markdown" });
          filename = "policy.md";
          break;
        }
        case "txt":
          blob = new Blob([new DOMParser().parseFromString(html, 'text/html').body.textContent || ''], { type: "text/plain" });
          filename = "policy.txt";
          break;
        case "html":
        default:
          blob = new Blob([html], { type: "text/html" });
          filename = "policy.html";
          break;
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Review & Download Your Policies
      </h2>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700">
          <span className="font-bold">Note:</span> You can now edit the
          generated policy directly in the editor below before downloading.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="html">HTML</option>
            <option value="txt">Text</option>
            <option value="pdf">PDF</option>
            <option value="md">Markdown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Scope
          </label>
          <select
            value={exportScope}
            onChange={(e) => setExportScope(e.target.value as ExportScope)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="combined">Combined in one file</option>
            <option value="separate">Separate files (in a ZIP)</option>
          </select>
        </div>
      </div>

      <LexicalEditorComponent
        initialHtml={generatedHtml}
        onChange={(editorState, editor) => setEditor(editor)}
      />

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="text-slate-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Download
        </button>
      </div>
    </div>
  );
}
