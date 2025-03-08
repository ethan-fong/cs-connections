import React, { useState, useEffect, useMemo, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

// Extract image links and hints from text.
function extractExtraElements(text) {
    let linkIndex = 1;
    const links = [];
    
    // Replace image URLs with a placeholder.
    let newText = text.replace(/\[(https?:\/\/[^\s\[\]]+)\]/gi, (_, url) => {
        links.push({ url, index: linkIndex });
        return `[Image ${linkIndex++}]`;
    });
    
    const hints = [];
    // Remove hint markers from the text and extract their content.
    newText = newText.replace(/\[hint:(.+?)\]/gi, (_, hint) => {
        hints.push(hint.trim());
        return ""; // Remove hint from the main text.
    });
    
    return { cleanedText: newText.trim(), links, hints };
}

// A simple spoiler component that initially hides its content.
function Spoiler({ children, label = "Show hint" }) {
    const [revealed, setRevealed] = useState(false);
    return (
        <div className="mb-2">
            {revealed ? (
                <div className="p-2 bg-gray-200 rounded-md">{children}</div>
            ) : (
                <button
                    className="p-2 bg-gray-300 rounded-md"
                    onClick={() => setRevealed(true)}
                >
                    {label}
                </button>
            )}
        </div>
    );
}

function RelatedInfo({ relevantInfo }) {
    if (!relevantInfo) return null;
    
    const { cleanedText, links, hints } = useMemo(
        () => extractExtraElements(relevantInfo),
        [relevantInfo]
    );

    const [imageLinks, setImageLinks] = useState([]);
    const fetchedImages = useRef(false);

    // Reset image fetch when the relevantInfo (and thus extracted data) changes.
    useEffect(() => {
        fetchedImages.current = false;
        setImageLinks([]);
    }, [relevantInfo]);

    useEffect(() => {
        if (fetchedImages.current || links.length === 0) return;
        fetchedImages.current = true;

        async function checkImages() {
            const checkImage = ({ url, index }) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve({ valid: true, url, index });
                    img.onerror = () => resolve({ valid: false, url, index });
                });

            const results = await Promise.all(links.map(checkImage));
            const validImages = results
                .filter(result => result.valid)
                .map(({ url, index }) => ({ url, index }))
                .sort((a, b) => a.index - b.index);

            setImageLinks((prev) => {
                if (
                    prev.length === validImages.length &&
                    prev.every((img, i) => img.url === validImages[i].url)
                ) {
                    return prev;
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
            
            {hints.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Hints</h4>
                    {hints.map((hint, i) => (
                        <Spoiler key={i} label={`Show Hint ${i + 1}`}>
                            <p>{hint}</p>
                        </Spoiler>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RelatedInfo;
