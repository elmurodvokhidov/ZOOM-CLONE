import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CallControls,
    CallParticipantsList,
    CallStatsButton,
    CallingState,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks
} from "@stream-io/video-react-sdk";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get("personal");
    const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
    const [showParticipants, setShowParticipants] = useState(false);
    const router = useRouter();

    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch (layout) {
            case "grid":
                return <PaginatedGridLayout />
            case "speaker-right":
                return <SpeakerLayout participantsBarPosition={"left"} />
            default:
                return <SpeakerLayout participantsBarPosition={"right"} />
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <div className="relative flex size-full items-center justify-center">
                <div className="flex size-full max-h-[1000px] items-center">
                    <CallLayout />
                </div>
                <div className={cn("h-[calc(100vh-86px)] hidden ml-2", { "show-block": showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
                <CallControls onLeave={() => router.push("/")} />

                <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]">
                            <LayoutList
                                size={20}
                                className="text-white"
                            />
                        </DropdownMenuTrigger>
                    </div>

                    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                        {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem
                                    onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                                    className="cursor-pointer">
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="border-dark-1" />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]">
                        <Users
                            size={20}
                            className="text-white"
                        />
                    </div>
                </button>
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    )
}

export default MeetingRoom