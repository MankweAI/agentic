import { SketchPicker } from "react-color";

interface Color {
  r: string;
  g: string;
  b: string;
  a: string;
}

interface ColorPickerProps {
  color: Color;
  setColor: (color: Color) => void;
}

function ColorPicker({ color, setColor }: ColorPickerProps) {
  // Handler for SketchPicker color change
  const handleSketchPickerChange = (color: any) => {
    const newColor: Color = {
      r: color.rgb.r.toString(),
      g: color.rgb.g.toString(),
      b: color.rgb.b.toString(),
      a: color.rgb.a !== undefined ? color.rgb.a.toString() : "1",
      };
      
      
    setColor(newColor);
  };

  return (
    <div className="App" style={{ display: "flex", justifyContent: "start" }}>
      <div className="sketchpicker">
        <p>Backround Color</p>
        {/* Div to display the color  */}
        <div
          style={{
            backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a})`,
            width: 100,
            height: 50,
            border: "2px solid white",
          }}
        ></div>
        {/* Sketch Picker from react-color and handling color on onChange event */}
        <SketchPicker
          color={{
            r: parseInt(color.r),
            g: parseInt(color.g),
            b: parseInt(color.b),
            a: parseFloat(color.a),
          }}
          onChange={handleSketchPickerChange}
        />
      </div>


    </div>
  );
}

export default ColorPicker;
