import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { useConfirmationDialogState } from "./hooks";

export const ConfirmationDialog = () => {
    const { isOpen, onOpenChange, options } = useConfirmationDialogState();

    return (
        <Modal
            hideCloseButton
            size="xl"
            isOpen={isOpen}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) {
                    options.onCancel?.();
                }
            }}
        >
            <ModalContent>
                <ModalHeader>
                    {options.title || "Confirm Action"}
                </ModalHeader>
                <ModalBody>
                    {options.message || "Are you sure you want to proceed with this action?"}
                </ModalBody>
                <ModalFooter>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="light"
                            onPress={() => {
                                onOpenChange(false);
                                options.onCancel?.();
                            }}
                        >
                            {options.cancelText || "Cancel"}
                        </Button>
                        <Button
                            variant="solid"
                            onPress={async () => {
                                onOpenChange(false);
                                await options.onConfirm?.();
                            }}
                        >
                            {options.confirmText || "Confirm"}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
