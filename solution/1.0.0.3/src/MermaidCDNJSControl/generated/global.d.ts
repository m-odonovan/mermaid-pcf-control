// global.d.ts
declare const mermaid: {
    initialize: (options?: object) => void;
    //render: (id: string, graph: string, callback: (svg: string) => void) => void;
   /* render: (
        id: string,
        text: string,
        cbOrElement?: Element | ((svgCode: string, bindFunctions: any) => void),
        container?: Element
    ) => void;*/
//    render: (id: string, text: string, svgContainingElement?: Element) => Promise<RenderResult>;
    run: (options?: object) => void;
    // Add more method definitions as needed
};



