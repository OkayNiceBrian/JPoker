import { memo, CSSProperties } from "react";
import "./styles/ChipGraphics.css";
import { ChipColors } from "@/helpers/ChipColors";

interface Props {
    chips: number;
}

const ChipGraphics = memo(function ChipGraphics({ chips }: Props) {
    const chipsString = chips.toString();
    const chipsCSSArray = [];

    for (let i = chipsString.length - 3; i >= 0; i--) {
        if (chipsString[i] === '0') {
            // Do Nothing
        } else if (i === chipsString.length - 3) {
            const cssStyle: CSSProperties = { backgroundColor: ChipColors[100], height: `${parseInt(chipsString[i])*10}%` };
            chipsCSSArray.unshift(cssStyle);
        } else if (i === chipsString.length - 4) {
            const cssStyle: CSSProperties = { backgroundColor: ChipColors[1000], height: `${parseInt(chipsString[i])*10}%` };
            chipsCSSArray.unshift(cssStyle);
        } else if (i === chipsString.length - 5) {
            const cssStyle: CSSProperties = { backgroundColor: ChipColors[10000], height: `${parseInt(chipsString[i])*10}%` };
            chipsCSSArray.unshift(cssStyle);
        } else if (i === chipsString.length - 6) {
            const cssStyle: CSSProperties = { backgroundColor: ChipColors[100000], height: `${parseInt(chipsString[i])*10}%` };
            chipsCSSArray.unshift(cssStyle);
        } else if (i === chipsString.length - 7) {
            const cssStyle: CSSProperties = { backgroundColor: ChipColors[1000000], height: `${parseInt(chipsString[i])*10}%` };
            chipsCSSArray.unshift(cssStyle);
        }
    }
    
    return (
        <div className="chipGraphics-container">
            { chipsCSSArray.map((style, index) => <div key={index} style={style} className="chipGraphics-chipStack" />) }
        </div>
    )
});

export default ChipGraphics;