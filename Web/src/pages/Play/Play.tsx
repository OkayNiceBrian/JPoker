import Game from "@/components/Game/Game";
import Chat from "@/components/Chat/Chat";
import "./Play.css";

const Play = () => {

    return (
        <div className="play-container">
            <Game/>
            <Chat/>
        </div>
    );
};

export default Play;