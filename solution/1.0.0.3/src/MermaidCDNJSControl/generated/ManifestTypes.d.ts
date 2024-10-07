/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    Theme: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3">;
    ImageStretch: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1">;
    Markup: ComponentFramework.PropertyTypes.StringProperty;
    MermaidCDNVersion: ComponentFramework.PropertyTypes.WholeNumberProperty;
}
export interface IOutputs {
}
