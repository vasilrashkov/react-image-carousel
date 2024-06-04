import { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

type ImageComponentProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: string;
    ref?: any;
    height?: string;
    maxHeight?: number;
    maxWidth?: number;
    style?: React.CSSProperties;

    onClick?: () => void;
};

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
    width,
    height,
    maxHeight,
    maxWidth,
    onClick,
}: ImageComponentProps, ref: ForwardedRef<HTMLImageElement>) {
    return (
        <StyledImage
            ref={ref}
            src={src}
            style={{...style, maxHeight, maxWidth}}
            alt={alt}
            onClick={onClick ? onClick : undefined}
            className={className}
        />
    );
});

export default Image;