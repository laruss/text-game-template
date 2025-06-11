import { Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

type SideBarProps = {
    side: 'left' | 'right';
    isClosedByDefault?: boolean;
    children?: ReactNode;
    itemsWhenClosed?: ReactNode[];
    className?: string;
    showToggleButton?: boolean; // Optional prop to control toggle button visibility
    openWidth?: number;
    closedWidth?: number;
};

const contentVariants = (side: SideBarProps['side']) => ({
    open: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.1,
            duration: 0.3
        }
    },
    closed: {
        opacity: 0,
        x: side === 'left' ? -20 : 20,
        transition: {
            duration: 0.2
        }
    }
} as const);

const closedItemsVariants = {
    open: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2
        }
    },
    closed: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.1,
            duration: 0.3
        }
    }
};

export const SideBar = ({
    side,
    isClosedByDefault,
    children,
    itemsWhenClosed,
    className = "",
    showToggleButton = true,
    openWidth = 400,
    closedWidth = 50,
}: SideBarProps) => {
    // Determine default state based on device and prop
    const getDefaultOpenState = () => {
        if (isClosedByDefault !== undefined) {
            return !isClosedByDefault;
        }
        return !isMobile; // Open on desktop, closed on mobile by default
    };

    const [isOpen, setIsOpen] = useState(getDefaultOpenState);

    // Re-evaluate state when device type changes (responsive behavior)
    useEffect(() => {
        if (isClosedByDefault === undefined) {
            setIsOpen(!isMobile);
        }
    }, [isClosedByDefault]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarVariants = {
        open: {
            width: isMobile ? "100vw" : openWidth,
            minWidth: isMobile ? "100vw" : closedWidth,
            maxWidth: isMobile ? "100vw" : openWidth,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            width: closedWidth,
            minWidth: closedWidth,
            maxWidth: closedWidth,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    const baseClasses =
        "h-full bg-default-50 dark:bg-default-100 border-r border-divider dark:border-default-200 " +
        "shadow-medium flex flex-col relative overflow-hidden";
    const sideSpecificClasses = side === 'right' ? 'border-r-0 border-l' : '';

    return (
        <motion.div
            className={twMerge(baseClasses, sideSpecificClasses, className)}
            variants={sidebarVariants}
            animate={isOpen ? "open" : "closed"}
            initial={false}
        >
            {/* Toggle Button */}
            {showToggleButton && (
                <div className="absolute top-4 z-10" style={{
                    [side === 'left' ? 'right' : 'left']: '8px'
                }}>
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        onPress={toggleSidebar}
                        className="bg-default-100 dark:bg-default-200"
                    >
                        {side === 'left' ?
                            (isOpen ? <FaChevronLeft /> : <FaChevronRight />) :
                            (isOpen ? <FaChevronRight /> : <FaChevronLeft />)
                        }
                    </Button>
                </div>
            )}

            {/* Closed State Content */}
            <AnimatePresence>
                {!isOpen && itemsWhenClosed && (
                    <motion.div
                        className={twMerge(
                            "flex flex-col items-center px-2 space-y-3",
                            showToggleButton ? "pt-16" : "pt-4"
                        )}
                        variants={closedItemsVariants}
                        initial="open"
                        animate="closed"
                        exit="open"
                    >
                        {itemsWhenClosed.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                {item}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Open State Content */}
            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        className={twMerge(
                            "flex-1 p-4 overflow-y-auto",
                            showToggleButton ? "pt-16" : "pt-4"
                        )}
                        variants={contentVariants(side)}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
