import React, { useState, useEffect, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractLinks(text) {
    const linkRegex = /\[(https?:\/\/[^\s\[\]]+)\]/gi; // Match any URL inside []
    let index = 1;
    const extractedLinks = [];

    const cleanedText = text.replace(linkRegex, (match, url) => {
        extractedLinks.push({ url, index });
        return `[Image ${index++}]`; // Replace with numbered placeholder
    });

    return { cleanedText: cleanedText.trim(), links: extractedLinks };
}

function RelatedInfo({ relevantInfo }) {
    if (!relevantInfo) return null;

    const [imageLinks, setImageLinks] = useState([]);
    const extractedData = useMemo(() => extractLinks(relevantInfo), [relevantInfo]);
    const { cleanedText, links } = extractedData;

    useEffect(() => {
        if (links.length === 0) return;
    
        async function checkImages() {
            const validImages = [];
    
            await Promise.all(
                links.map(async ({ url, index }) => {
                    try {
                        const response = await fetch(url, { method: "HEAD" });
                        const contentType = response.headers.get("Content-Type");
                        if (contentType && contentType.startsWith("image/")) {
                            validImages.push({ url, index });
                        }
                    } catch (error) {
                        console.error(`Failed to check image URL: ${url}`, error);
                    }
                })
            );
    
            // Update state only if the data actually changed
            setImageLinks((prev) => {
                const prevUrls = new Set(prev.map((img) => img.url));
                const newUrls = new Set(validImages.map((img) => img.url));
                if (prevUrls.size === newUrls.size && [...prevUrls].every((url) => newUrls.has(url))) {
                    return prev; // No change, prevent unnecessary re-render
                }
                return validImages;
            });
        }
    
        checkImages();
    }, [links]);

    return (
        <div className="related-info-container p-4 mb-4 bg-gray-100 rounded-lg shadow-md mt-4 mx-4">
            <h4 className="text-lg font-semibold mb-2">Extra Information</h4>

            {cleanedText && (
                <SyntaxHighlighter language="markdown" style={solarizedlight}>
                    {cleanedText}
                </SyntaxHighlighter>
            )}

            {imageLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                    {imageLinks.map(({ url, index }) => (
                        <div key={url} className="flex flex-col items-center">
                            <span className="text-sm font-semibold">[Image {index}]</span>
                            <img
                                src={url}
                                alt={`Extra info ${index}`}
                                className="max-w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RelatedInfo;
