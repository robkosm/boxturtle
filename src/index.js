import { Polygon, SVG } from "@svgdotjs/svg.js";
import * as dat from "dat.gui";
import * as vec2 from "gl-vec2";

let draw = SVG().addTo("body").size(800, 800);

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

class shiftedSurfaceDrawer {
    constructor() {
        this.nextSegmentPosition = vec2.fromValues(100, 100);
        this.nextSegmentRotation = 0; // degrees
    }

    drawSurface() {
        // draw Face
        // element.transform({
        //     rotate: 125,
        //     translateX: 50,
        //     translateY: 100,
        //     scale: 3
        //   })
        // draw Bend
        // draw Face
        // draw Bend
        // draw Face
        // draw Bend
        // draw Face
        // draw Bend
    }

    drawTrapezium(topWidth, bottomWidth, height, bottomShift) {
        let vertices = [];

        vertices.push([topWidth, 0]); // top right
        vertices.push([0, 0]); // top left
        vertices.push([(topWidth - bottomWidth) / 2 + bottomShift, height]); // bottom left
        vertices.push([
            bottomWidth - (topWidth - bottomWidth) / 2 + bottomShift,
            height,
        ]); // bottom right

        let leftSegment = vec2.create();
        vec2.sub(
            leftSegment,
            vec2.fromValues((topWidth - bottomWidth) / 2 + bottomShift, height),
            vec2.fromValues(0, 0)
        );
        const leftSideAngle =
            (Math.acos(leftSegment[1] / vec2.length(leftSegment)) * 360) /
            Math.PI;

        let rightSegment = vec2.create();
        vec2.sub(
            rightSegment,
            vec2.fromValues(
                bottomWidth - (topWidth - bottomWidth) / 2 + bottomShift,
                height
            ),
            vec2.fromValues(topWidth, 0)
        );
        const rightSideAngle =
            (Math.acos(rightSegment[1] / vec2.length(rightSegment)) * 360) /
            Math.PI;

        const angleBetweenSides = leftSideAngle - rightSideAngle;

        let poly = draw
            .polygon("0,0 100,50 50,100")
            .fill("red")
            .stroke({ width: 1 });
        poly.plot(vertices);
        poly.transform({
            rotate: this.nextSegmentRotation + leftSideAngle,
            translateX: this.nextSegmentPosition[0],
            translateY: this.nextSegmentPosition[1],
            scale: 1,
        });

        vec2.add(
            this.nextSegmentPosition,
            this.nextSegmentPosition,
            vec2.fromValues(topWidth, 0)
        );
        this.nextSegmentRotation += angleBetweenSides;
    }

    drawNextSegmentTransform() {
        let ellipse = draw.ellipse(10, 10).fill("green");
        ellipse.transform({
            rotate: this.nextSegmentRotation,
            translateX: this.nextSegmentPosition[0],
            translateY: this.nextSegmentPosition[1],
            scale: 1,
        });

        let arrow = draw.line(
            this.nextSegmentPosition[0],
            this.nextSegmentPosition[1],
            this.nextSegmentPosition[0] +
                100 * Math.cos(this.nextSegmentRotation),
            this.nextSegmentPosition[1] +
                100 * Math.sin(this.nextSegmentRotation)
        ).stroke({ color: 'blue', width: 5 });
    }
}

