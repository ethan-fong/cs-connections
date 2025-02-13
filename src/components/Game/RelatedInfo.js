import React, { useState, useEffect, useMemo, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractLinks(text) {
    const linkRegex = /\[(https?:\/\/[^\s\[\]]+)\]/gi; // Match any URL inside []
    let index = 1;
    const extractedLinks = [];

    const cleanedText = text.replace(linkRegex, (_, url) => {
        extractedLinks.push({ url, index });
        return `[Image ${index++}]`; // Replace with numbered placeholder
    });

    return { cleanedText: cleanedText.trim(), links: extractedLinks };
}

function RelatedInfo({ relevantInfo }) {
    //console.log("relevant info", relevantInfo);
    if (!relevantInfo) return null;

    const extractedData = useMemo(() => extractLinks(relevantInfo), [relevantInfo]);
    const { cleanedText, links } = extractedData;

    const [imageLinks, setImageLinks] = useState([]);
    const fetchedImages = useRef(false);

    // Reset fetchedImages flag when relevantInfo changes to allow re-fetching images.
    useEffect(() => {
        fetchedImages.current = false;
        setImageLinks([]);
    }, [relevantInfo]);

    useEffect(() => {
        //console.log("Links changed", links);
        if (fetchedImages.current || links.length === 0) return;
        fetchedImages.current = true;

        async function checkImages() {
            const checkImage = ({ url, index }) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
            
                    img.onload = () => resolve({ valid: true, url, index });
                    img.onerror = () => resolve({ valid: false, url, index });
            
                });
            };

            const results = await Promise.all(links.map(checkImage));
            const validImages = results
                .filter(result => result.valid)
                .map(({ url, index }) => ({ url, index }))
                .sort((a, b) => a.index - b.index);
            //console.log("Valid images", validImages);
            setImageLinks((prev) => {
                if (
                    prev.length === validImages.length &&
                    prev.every((img, i) => img.url === validImages[i].url)
                ) {
                    return prev; // Prevent unnecessary re-renders
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
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                    {imageLinks.map(({ url, index }) => (
                        <div key={url} className="flex flex-col items-center">
                            <span className="text-sm font-semibold mb-2">[Image {index}]</span>
                            <img
                                src={url}
                                alt={`Extra info ${index}`}
                                loading="lazy"
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
