import { SVG } from "@svgdotjs/svg.js";
import * as dat from "dat.gui";

let draw = SVG().addTo("body").size(300, 300);
let rect = draw.rect(100, 100).attr({ fill: "#f06" });

let settings = {
    // lasercutter
    cutColor: "#FF0000",
    engraveDeepColor: "#0000FF",
    engraveShallowColor: "#FF00FF",

    // box
    boxTopW: 10,
    boxTopH: 10,
    boxBottomW: 10,
    boxBottomH: 10,
    boxHeight: 20,
    boxShiftX: 0,
    boxShiftY: 0,

    topRadius: 3,
    bottomRadius: 3,
    minBendRadius: 1,
    slitsPerRotation: 40,

    // buttons
    useSettings: function () {
        console.log("new settings");
        console.log(settings.cutColor);
    },
};

function makeGUI() {
    let gui = new dat.GUI();

    let cutSettingsFolder = gui.addFolder("Laser Cutter Settings");
    cutSettingsFolder.addColor(settings, "cutColor");
    cutSettingsFolder.addColor(settings, "engraveDeepColor");
    cutSettingsFolder.addColor(settings, "engraveShallowColor");
    cutSettingsFolder.open();

    let boxSettingsFolder = gui.addFolder("Box Settings");
    boxSettingsFolder.add(settings, "boxTopW");
    boxSettingsFolder.add(settings, "boxTopH");

    boxSettingsFolder.add(settings, "boxBottomW");
    boxSettingsFolder.add(settings, "boxBottomH");

    boxSettingsFolder.add(settings, "boxHeight");
    boxSettingsFolder.open();

    let bendSettingsFolder = gui.addFolder("Bend Settings");
    bendSettingsFolder.add(settings, "minBendRadius");
    bendSettingsFolder.add(settings, "slitsPerRotation");
    bendSettingsFolder.add(settings, "topRadius");
    bendSettingsFolder.add(settings, "bottomRadius");
    bendSettingsFolder.open();

    let buttonFolder = gui.addFolder("Buttons");
    buttonFolder.add(settings, "useSettings");
    buttonFolder.open();

    gui.open();
}

makeGUI();