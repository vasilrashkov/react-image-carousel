import styled from "styled-components";

type ImageComponentProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: string;
    height?: string;
    maxHeight?: number;
    maxWidth?: number;

    onClick?: () => void;
};

const StyledImage = styled.img<{ maxHeight?: number; maxWidth?: number; }>`
    ${props => props.maxHeight && `max-height: ${props.maxHeight}px;`}
    ${props => props.maxWidth && `max-width: ${props.maxWidth}px;`}
    display: block;
    width: auto;
    height: auto;
`;

const Image: React.FC<ImageComponentProps> = ({
    src,
    alt = "image-component",
    className,
    width,
    height,
    maxHeight,
    maxWidth,
    onClick,
}) => {
    return (
        <StyledImage
            src={src}
            alt={alt}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            onClick={onClick ? onClick : undefined}
            className={className}
            style={{ width, height }}
        />
    );
};

export default Image;