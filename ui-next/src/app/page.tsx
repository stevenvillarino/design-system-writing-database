"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Types
interface Term {
  id: string;
  term: string;
  platform: string;
  approved: boolean;
  explanation?: string;
}

export default function Home() {
  // State
  const [status, setStatus] = useState<string>("Loading...");
  const [error, setError] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [invalidTerms, setInvalidTerms] = useState<string[]>([]);
  const [validation, setValidation] = useState<{ result: string; suggestions: string[] } | null>(null);

  // Figma plugin messaging
  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage;
      if (!message) return;
      if (message.type === "error") {
        setError(message.message);
        setStatus("Error occurred");
        setTerms([]);
      } else if (message.type === "update-terms") {
        setStatus(`Loaded ${message.terms.length} terms`);
        setError("");
        setTerms(message.terms);
      } else if (message.type === "invalid-terms-found") {
        setInvalidTerms(message.terms);
      } else if (message.type === "update-platforms") {
        setPlatforms(message.platforms);
      } else if (message.type === "validation-result") {
        setValidation(message.validation);
      }
    };
  }, []);

  // Handlers
  const handlePlatformClick = (platform: string) => {
    setSelectedPlatform(platform);
    setStatus("Filtering terms...");
    window.parent.postMessage({ pluginMessage: { type: "platform-changed", platform } }, "*");
  };

  const handleScan = () => {
    window.parent.postMessage({ pluginMessage: { type: "scan-frame" } }, "*");
  };

  const handleTermClick = (term: string) => {
    window.parent.postMessage({ pluginMessage: { type: "create-text", text: term } }, "*");
  };

  // Filtered terms
  const filteredTerms = selectedPlatform
    ? terms.filter((t) => t.platform === selectedPlatform)
    : terms;

  return (
    <div className="flex flex-col h-screen p-6 font-sans text-[#333] bg-white">
      {/* Status */}
      <div className="status text-sm mb-4 p-3 bg-gray-100 rounded-lg text-gray-600">{status}</div>

      {/* Platform Selector */}
      <div className="platform-grid grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Button
          variant={selectedPlatform === "" ? "default" : "outline"}
          onClick={() => handlePlatformClick("")}
        >
          All Platforms
        </Button>
        {platforms.map((platform) => (
          <Button
            key={platform}
            variant={selectedPlatform === platform ? "default" : "outline"}
            onClick={() => handlePlatformClick(platform)}
          >
            {platform}
          </Button>
        ))}
      </div>

      {/* Scan Button */}
      <Button
        className="scan-button w-full py-4 bg-blue-500 text-white rounded-lg text-base font-medium mb-6 transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        onClick={handleScan}
      >
        Scan Selected Frame
      </Button>

      {/* Error */}
      {error && (
        <div className="error p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      )}

      {/* Terms List */}
      <div className="terms-list flex-1 overflow-y-auto mb-6 pr-4 min-h-0">
        {filteredTerms.length === 0 ? (
          <div className="empty-state text-center p-5 text-gray-500 italic">No terms found</div>
        ) : (
          filteredTerms.map((term) => (
            <Card
              key={term.id}
              className="term-item p-4 my-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-300"
              onClick={() => handleTermClick(term.term)}
            >
              <div className="term-text font-medium mb-2 text-[#1a1a1a] text-base">{term.term}</div>
              <div className="term-explanation text-sm text-gray-600 leading-relaxed">{term.explanation}</div>
            </Card>
          ))
        )}
      </div>

      {/* Invalid Terms Section */}
      {invalidTerms.length > 0 && (
        <div className="invalid-terms mt-5 p-4 bg-red-100 rounded-lg">
          <h3 className="text-red-700 mt-0 mb-2 font-semibold">Invalid Terms Found</h3>
          <div>
            {invalidTerms.map((term, idx) => (
              <div key={idx} className="invalid-term-item p-3 bg-white rounded mb-2 text-sm">
                {term}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Section */}
      {validation && (
        <div className="validation-section p-5 rounded-lg mt-5 bg-gray-50">
          <h3 className="font-semibold mb-2">Term Validation</h3>
          <div id="validationResult">
            {validation.result}
          </div>
          {validation.suggestions && validation.suggestions.length > 0 && (
            <div className="suggestions mt-2 p-3 bg-white rounded">
              {validation.suggestions.map((s, idx) => (
                <div key={idx} className="suggestion-item p-3 my-2 border rounded cursor-pointer text-sm hover:bg-gray-100">
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
