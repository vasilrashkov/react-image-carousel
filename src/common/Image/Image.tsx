type ImageComponentProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: string;
    height?: string;

    onClick?: () => void;
};

const Image: React.FC<ImageComponentProps> = ({ 
    src, 
    alt = "image-component", 
    className, 
    width, 
    height, 
    onClick,
}) => {
    return (
        <img 
            src={src} 
            alt={alt} 
            onClick={onClick ? onClick : undefined}
            className={className}
            style={{ width, height }}
        />
    );
};

export default Image;