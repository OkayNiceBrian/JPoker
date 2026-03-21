import "./Home.css";
import bgImg from "@/assets/background.jpg";

const Home = () => {

    const EnterUsername = () => {
        return (
            <div className="enterUsername-container">
                <p>Enter Username</p>
                <input />
                <input type="button" value={"Submit"}/>
            </div>
        );
    }

    return (
        <>
            <div className="home-container">
                <img src={bgImg} className="home-backgroundImage" />
                <div className="jpoker-logo-background">
                    <p className="jpoker-logo-typography">JPoker</p>
                    <p className="">The World's #1 (shitty) Poker Website!</p>
                </div>
                <EnterUsername />
            </div>
        </>
    );
};

export default Home;