import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    copied: boolean;
}

interface ErrorBoundaryProps extends PropsWithChildren {
    fallback?: (
        error: Error,
        errorInfo: ErrorInfo,
        reset: () => void
    ) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary catches all JavaScript errors in the application:
 * - Rendering errors
 * - Event handler errors
 * - Async errors (promises, setTimeout)
 * - Global uncaught errors
 */
export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            copied: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidMount(): void {
        // Catch global errors (event handlers, setTimeout, etc.)
        window.addEventListener("error", this.handleGlobalError);

        // Catch unhandled promise rejections
        window.addEventListener(
            "unhandledrejection",
            this.handlePromiseRejection
        );
    }

    componentWillUnmount(): void {
        window.removeEventListener("error", this.handleGlobalError);
        window.removeEventListener(
            "unhandledrejection",
            this.handlePromiseRejection
        );
    }

    handleGlobalError = (event: ErrorEvent): void => {
        event.preventDefault();

        // Handle different error types
        let error: Error;
        if (event.error instanceof Error) {
            error = event.error;
        } else if (event.message) {
            error = new Error(event.message);
        } else {
            // Fallback for events without error or message (e.g., resource load errors)
            const target = event.target as HTMLElement;
            const targetInfo = target
                ? `${target.tagName}${target.id ? `#${target.id}` : ""}${target.className ? `.${target.className.split(" ").join(".")}` : ""}`
                : "unknown element";
            error = new Error(
                `Resource error or unhandled error on ${targetInfo}`
            );
        }

        const errorInfo: ErrorInfo = {
            componentStack: `\nGlobal error at ${event.filename || "unknown"}:${event.lineno || 0}:${event.colno || 0}`,
        };

        console.error("Global error caught:", error, event);

        this.setState({
            hasError: true,
            error,
            errorInfo,
        });

        this.props.onError?.(error, errorInfo);
    };

    handlePromiseRejection = (event: PromiseRejectionEvent): void => {
        event.preventDefault();

        const error =
            event.reason instanceof Error
                ? event.reason
                : new Error(String(event.reason));

        const errorInfo: ErrorInfo = {
            componentStack: "\nUnhandled Promise Rejection",
        };

        console.error("Unhandled promise rejection:", error);

        this.setState({
            hasError: true,
            error,
            errorInfo,
        });

        this.props.onError?.(error, errorInfo);
    };

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    reset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    copyErrorToClipboard = async (): Promise<void> => {
        if (!this.state.error || !this.state.errorInfo) return;

        const errorText = [
            `Error: ${this.state.error.message}`,
            "",
            "Stack Trace:",
            this.state.error.stack || "No stack trace available",
            "",
            "Component Stack:",
            this.state.errorInfo.componentStack ||
                "No component stack available",
        ].join("\n");

        try {
            await navigator.clipboard.writeText(errorText);
            this.setState({ copied: true });
            setTimeout(() => {
                this.setState({ copied: false });
            }, 1000);
        } catch (err) {
            console.error("Failed to copy error to clipboard:", err);
        }
    };

    render(): ReactNode {
        const errorOverlay =
            this.state.hasError && this.state.error && this.state.errorInfo ? (
                // Use custom fallback if provided
                this.props.fallback ? (
                    this.props.fallback(
                        this.state.error,
                        this.state.errorInfo,
                        this.reset
                    )
                ) : (
                    // Default fallback UI as overlay
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-8">
                        <div className="max-w-2xl w-full bg-danger-50 border-2 border-danger-500 rounded-lg p-6 shadow-lg relative">
                            <button
                                onClick={this.reset}
                                className="absolute top-4 right-4 text-danger-600 hover:text-danger-800 font-bold text-2xl leading-none transition-colors"
                                aria-label="Close error"
                            >
                                ×
                            </button>
                            <h1 className="text-2xl font-bold text-danger-900 mb-4">
                                Game Error
                            </h1>
                            <p className="text-danger-800 mb-4">
                                Something went wrong while running the game.
                                This error has been logged.
                            </p>
                            <details className="mb-4">
                                <summary className="cursor-pointer text-danger-900 font-semibold mb-2 flex items-center justify-between">
                                    <span>Error Details</span>
                                    <div className="flex items-center gap-2">
                                        {this.state.copied && (
                                            <span className="text-sm text-danger-700">
                                                Copied to clipboard
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                void this.copyErrorToClipboard();
                                            }}
                                            className="text-danger-600 hover:text-danger-800 transition-colors"
                                            title="Copy error to clipboard"
                                            aria-label="Copy error to clipboard"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect
                                                    x="9"
                                                    y="9"
                                                    width="13"
                                                    height="13"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </summary>
                                <div className="bg-danger-100 p-4 rounded border border-danger-300 overflow-auto">
                                    <p className="font-mono text-sm text-danger-900 mb-2">
                                        <strong>Error:</strong>{" "}
                                        {this.state.error.message}
                                    </p>
                                    <p className="font-mono text-xs text-danger-800 whitespace-pre-wrap">
                                        {this.state.error.stack}
                                    </p>
                                    {import.meta.env.DEV &&
                                        this.state.errorInfo.componentStack && (
                                            <p className="font-mono text-xs text-danger-800 whitespace-pre-wrap mt-4">
                                                <strong>
                                                    Component Stack:
                                                </strong>
                                                {
                                                    this.state.errorInfo
                                                        .componentStack
                                                }
                                            </p>
                                        )}
                                </div>
                            </details>
                            <button
                                onClick={this.reset}
                                className="bg-danger-600 hover:bg-danger-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )
            ) : null;

        return (
            <>
                {this.props.children}
                {errorOverlay}
            </>
        );
    }
}
