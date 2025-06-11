import { useWindowHeight } from "@app/hooks/useWindowHeight";
import { ConfirmationDialog } from "@components/ConfiramtionDialog";
import { Header } from "@components/Header";
import { PassageController } from "@components/PassageController";
import { SaveLoadModal } from "@components/SaveLoadModal";
import { SideBar } from "@components/SideBar";

export const App = () => {
    const height = useWindowHeight();

    return (
        <main
            className="light text-foreground bg-background inline-flex w-full h-full"
            style={{ height }}
        >
            <SideBar side="left" className="bg-primary-50">
                This is the left sidebar.
            </SideBar>
            <div className="flex flex-col w-full h-full flex-grow overflow-hidden">
                <Header />
                <div className="flex-grow overflow-y-auto overflow-x-hidden">
                    <PassageController />
                </div>
            </div>
            <SaveLoadModal />
            <ConfirmationDialog />
        </main>
    );
};
