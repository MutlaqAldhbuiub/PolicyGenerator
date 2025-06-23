"use client";

import { FormData } from "@/types";
import { templates } from "@/lib/templates";
import { useEffect, useState } from "react";
import JSZip from "jszip";

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
  createEditor,
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

type ExportFormat = "txt" | "html";
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
  onChange: (editor: LexicalEditor) => void;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative border border-gray-200 rounded-lg shadow-sm">
        <ToolbarPlugin />
        <div className="editor-inner relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="h-96 overflow-y-auto p-6 bg-white rounded-b-lg prose prose-lg max-w-none focus:outline-none editor-input"
                style={{ fontFamily: "'Lora', serif" }}
              />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none italic">
                You can make edits to the generated policy here...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <InitialHtmlPlugin initialHtml={initialHtml} />
        <OnChangePlugin
          onChange={(editorState, editor) => {
            onChange(editor);
          }}
        />
      </div>
    </LexicalComposer>
  );
}

// The main review step component
export default function Step4Review({ prevStep, formData }: Props) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("txt");
  const [exportScope, setExportScope] = useState<ExportScope>("combined");

  const initialHtmlContent = generateCombinedPolicyHtml(formData);

  const handleDownload = async () => {
    if (!editor) return;

    if (exportScope === "separate") {
      const zip = new JSZip();
      // This is a complex task. For now, we generate separate files from the original templates, not the edited content.
      // A more robust solution would parse the edited HTML.
      formData.policies.forEach((policyKey) => {
        if (isValidPolicyKey(policyKey)) {
          const html = generateSinglePolicyHtml(policyKey, formData);
          const tempEditor = createEditor(editorConfig);
          const text = tempEditor
            .parseEditorState(
              tempEditor.getEditorState().read(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(html, "text/html");
                const nodes = $generateNodesFromDOM(tempEditor, dom);
                $getRoot()
                  .clear()
                  .append(...nodes);
                return $getRoot().getTextContent();
              })
            )
            .read(() => $getRoot().getTextContent());

          const content = exportFormat === "html" ? html : text;
          zip.file(`${policyKey}.${exportFormat}`, content);
        }
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "policies.zip";
        a.click();
        URL.revokeObjectURL(url);
      });
    } else {
      // Combined download
      let content: string = "";
      if (exportFormat === "html") {
        content = await new Promise((resolve) => {
          editor.update(() => {
            resolve($generateHtmlFromNodes(editor, null));
          });
        });
      } else {
        // txt format
        content = editor
          .getEditorState()
          .read(() => $getRoot().getTextContent());
      }

      const blob = new Blob([content], { type: `text/${exportFormat}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `policy.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <h2
        className="text-3xl font-bold text-gray-800 mb-6"
        style={{ fontFamily: "'Lora', serif" }}
      >
        Step 6: Review, Edit, and Download Your Policies
      </h2>

      <div className="mb-8">
        <LexicalEditorComponent
          initialHtml={initialHtmlContent}
          onChange={setEditor}
        />
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3
          className="text-xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Download Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope
            </label>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value as ExportScope)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            >
              <option value="combined">Combined File</option>
              <option value="separate">Separate Files (.zip)</option>
            </select>
          </div>
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            >
              <option value="txt">Plain Text (.txt)</option>
              <option value="html">HTML (.html)</option>
            </select>
          </div>
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
          onClick={handleDownload}
          disabled={!editor}
          className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
