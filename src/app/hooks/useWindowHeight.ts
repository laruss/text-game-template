import { useEffect, useState } from "react";

export const useWindowHeight = () => {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const updateHeight = () => setHeight(window.innerHeight);
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return height;
};
