import { ImageComponent } from "@engine/passages/story";
import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { twMerge } from "tailwind-merge";

type ImageModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    src: string;
    alt?: string;
};

const ImageModal = ({ isOpen, onOpenChange, src, alt }: ImageModalProps) => (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
            <img
                src={src}
                alt={alt ?? "image"}
                className="max-w-full max-h-full"
            />
        </ModalContent>
    </Modal>
);

export const Image = ({ component }: { component: ImageComponent }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const shouldBeClickable = Boolean(component.props?.onClick) || !component.props?.disableModal;

    const onClickHandler = () => {
        if (component.props?.onClick) {
            component.props.onClick();
        }
        if (!component.props?.disableModal) {
            onOpen();
        }
    };

    return (
        <>
            <img
                src={component.content}
                alt={component.props?.alt ?? "image"}
                className={twMerge(
                    "max-w-200 max-h-200 object-contain mx-auto",
                    shouldBeClickable && "cursor-pointer",
                    component.props?.className
                )}
                onClick={onClickHandler}
            />
            {!component.props?.disableModal && (
                <ImageModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    src={component.content}
                    alt={component.props?.alt}
                />
            )}
        </>
    );
};
