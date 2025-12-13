"use client";

import { useState, useEffect, useRef } from "react";

const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

interface TextScrambleProps {
    children: string;
    className?: string;
    duration?: number;
    speed?: number;
    revealsDuration?: number;
    revealsDelay?: number;
    trigger?: boolean;
}

export const TextScramble = ({
    children,
    className,
    duration = 0.4,
    speed = 0.04,
    trigger = false,
}: TextScrambleProps) => {
    const [text, setText] = useState(children);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        let pos = 0;

        intervalRef.current = setInterval(() => {
            const scrambled = children.split("")
                .map((char, index) => {
                    if (pos / 5 > index) {
                        return char;
                    }
                    const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
                    return randomChar;
                })
                .join("");

            setText(scrambled);
            pos++;

            if (pos / 5 >= children.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setText(children);
            }
        }, 20);
    };

    const stopScramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setText(children);
    };

    useEffect(() => {
        if (trigger) {
            scramble();
        } else {
            stopScramble();
        }
    }, [trigger]);

    return (
        <span
            className={className}
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
        >
            {text}
        </span>
    );
};

export default TextScramble;
