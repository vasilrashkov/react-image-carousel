import { createRoot } from "react-dom/client";

const ElementHelper = {
    getImageHeight: async (src: string): Promise<number> => {
        console.log("Src:", src);
        try {
            const height = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img.height);
                img.onerror = reject;
                img.src = src;
            });
            return height as number;
        } catch (error) {
            console.error('Error:', error);
            return 0;
        }
    },
    getElementVirtualHeight: (Element: React.ReactNode) => {
        const div = document.createElement('div');

        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.height = 'auto';
        div.style.width = 'auto';
        div.style.overflow = 'hidden';

        // Append the div to body
        document.body.appendChild(div);

        const root = createRoot(div);

        root.render(Element);

        const height = div.clientHeight;

        root.unmount();
        document.body.removeChild(div);

        return height;
    },
};

export default ElementHelper;