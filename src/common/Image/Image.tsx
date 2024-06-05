import { ForwardedRef, forwardRef, useState } from "react";
import styled from "styled-components";

type ImageComponentProps = {
    src: string;
    alt?: string;
    className?: string;
    maxHeight?: number;
    maxWidth?: number;
    style?: React.CSSProperties;

    onClick?: () => void;
};

const ErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    color: #000;
    font-size: 1.5rem;
    font-weight: 500;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledImage = styled.img`
    ${props => props.style?.maxHeight && `max-height: ${props.style?.maxHeight}px;`}
    ${props => props.style?.maxWidth && `max-width: ${props.style?.maxWidth}px;`}
    display: block;
    width: auto;
    height: ${props => props.style?.height ? props.style?.height : "auto"};
`;

const Image: React.FC<ImageComponentProps> = forwardRef(function Image({
    src,
    style,
    alt = "image-component",
    className,
    maxHeight,
    maxWidth,
    onClick,
}: ImageComponentProps, ref: ForwardedRef<HTMLImageElement>) {
    const [errorLoadingImage, setErrorLoadingImage] = useState<boolean>(false);

    const onError = () => {
        setErrorLoadingImage(true);
    };

    if (errorLoadingImage) return (
        <ErrorContainer style={{ ...style }}>
            Error loading image
        </ErrorContainer>
    );

    return (
        <StyledImage
            ref={ref}
            onError={onError}
            src={src}
            style={{...style, maxHeight, maxWidth}}
            alt={alt}
            onClick={onClick ? onClick : undefined}
            className={className}
        />
    );
});

export default Image;