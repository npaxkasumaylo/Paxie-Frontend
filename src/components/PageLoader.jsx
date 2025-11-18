import BotIcon from "./BotIcon";

export default function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/adminBG.png')] select-none">
            <div className="absolute inset-0 bg-black/50"></div> 
            <div className="absolute text-center">
                <div className="inline-flex items-center justify-center rounded-full animate-bounce">
                    <BotIcon h={250} w={250} className="text-white/80"/>
                </div>
            </div>
        </div>
    )
}