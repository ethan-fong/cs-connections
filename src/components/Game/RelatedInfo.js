import React, { useState, useEffect } from "react";
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

    const { cleanedText, links } = extractLinks(relevantInfo);
    const [imageLinks, setImageLinks] = useState([]);

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

            setImageLinks(validImages);
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
                        <div key={index} className="flex flex-col items-center">
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
