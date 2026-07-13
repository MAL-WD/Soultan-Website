import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EachCharacter = ({
    char,
    start,
    end,
    progress,
    duration,
    easing,
    index,
    transitionStartIndex,
}) => {
    const colorProgress = useTransform(
        progress,
        [start, end],
        ["#E5E7EB", "#02110C"]
    );
    const initialColor = index < transitionStartIndex ? "#02110C" : "#E5E7EB";
    return (
        <motion.span
            style={{
                color:
                    index < transitionStartIndex ? initialColor : colorProgress,
            }}
            transition={{ duration: duration, ease: easing }}
        >
            {char}
        </motion.span>
    );
};

const EachWord = ({
    word,
    progress,
    starting,
    ending,
    duration,
    easing,
    transitionStartIndex,
    currentCharacterIndex,
}) => {
    const characters = word.split("");
    const wordLength = word.length;
    const amount = ending - starting;
    const step = amount / wordLength;
    return (
        <motion.span className="inline-block">
            {characters.map((char, idx) => {
                const charStart = starting + step * idx;
                const charEnd = starting + step * (idx + 1);
                return (
                    <EachCharacter
                        key={idx}
                        char={char}
                        start={charStart}
                        end={charEnd}
                        progress={progress}
                        duration={duration}
                        easing={easing}
                        index={currentCharacterIndex + idx}
                        transitionStartIndex={transitionStartIndex}
                    />
                );
            })}
            &nbsp;
        </motion.span>
    );
};

export const TextColorLetters = (props) => {
    const {
        text,
        duration = 0.5,
        easing = "easeInOut",
        fontSize = 48,
        lineHeight = 1.2, // Use unitless for better responsiveness
        letterSpacing = -2,
        paragraphAlign = "center",
        transitionStartIndex = 40,
        fontFamily = "Inter",
        fontWeight = 700,
        isRTL = false,
    } = props;
    
    const words = text.split(" ");
    const totalWords = words.length;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.85", "start 0.25"], // Slightly adjusted for better feel
    });

    // Helper to dynamically load font if needed
    useEffect(() => {
        if (!fontFamily || isRTL) return; // ThmanyahSerif fonts are local, skip Google Fonts for it
        const style = document.createElement("style");
        style.appendChild(
            document.createTextNode(`
            @import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@400;700&display=swap');
        `)
        );
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [fontFamily, isRTL]);

    let currentCharacterIndex = 0;

    return (
        <p
            ref={ref}
            style={{
                fontFamily: fontFamily ? `${fontFamily}, sans-serif` : (isRTL ? "'ThmanyahSerifDisplay', 'ThmanyahSerifText', sans-serif" : `Inter, sans-serif`),
                fontSize: `clamp(24px, 5vw, ${fontSize}px)`, // Fluid font size
                color: "#E5E7EB",
                display: "flex",
                flexWrap: "wrap",
                fontWeight: fontWeight,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                justifyContent: paragraphAlign === "left" ? (isRTL ? "flex-end" : "flex-start") : paragraphAlign === "right" ? (isRTL ? "flex-start" : "flex-end") : "center",
                margin: 0,
                textAlign: paragraphAlign,
                direction: isRTL ? 'rtl' : 'ltr',
            }}
            className="relative z-20 w-full"
        >
            {words.map((word, idx) => {
                const starting = idx / totalWords;
                const ending = (idx + 1) / totalWords;
                const wordLength = word.length;
                const startIdx = currentCharacterIndex;
                currentCharacterIndex += wordLength + 1; // Including space

                return (
                    <EachWord
                        key={idx}
                        word={word}
                        progress={scrollYProgress}
                        starting={starting}
                        ending={ending}
                        duration={duration}
                        easing={easing}
                        transitionStartIndex={transitionStartIndex}
                        currentCharacterIndex={startIdx}
                    />
                );
            })}
        </p>
    );
};
