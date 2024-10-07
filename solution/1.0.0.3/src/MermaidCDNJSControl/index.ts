import { IInputs, IOutputs } from "./generated/ManifestTypes";



export class MermaidCDNJSControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private mermaidContainer: HTMLDivElement;
    private markupContainer: HTMLPreElement;
    private svgStyleElement: HTMLStyleElement;

    private isMermaidLoaded: boolean = false;



    private _themeDisplayNames: { [key: number]: string } = {
        0: "default",
        1: "dark",
        2: "forest",
        3: "neutral"
    };

    private _imageSize: { [key: number]: string } = {
        0: "default",
        1: "stretched"
    };



    // Declare the mermaid global variable within a global block

    //private mermaid: <Mermaid

    /**
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code

        this.mermaidContainer = container;

        this.markupContainer = document.createElement("pre");
        this.markupContainer.setAttribute("id", "mermaidCtnr");
        this.markupContainer.className = "mermaid";
        this.markupContainer.style.width = "100%";
        this.markupContainer.style.height = "100%";
        container.appendChild(this.markupContainer);

        //style element to change the style of the generated SVG, used later to set width/height
        this.svgStyleElement = document.createElement('style');
        container.appendChild(this.svgStyleElement);

        //set version to 10 by default if property not set
        const cdnVersion = context.parameters.MermaidCDNVersion.raw!
        ? context.parameters.MermaidCDNVersion.raw!
        : 10;
        

        // Dynamically load the Mermaid.js module
        this.loadMermaidModule(cdnVersion).then(() => {
            console.log("Mermaid.js module loaded successfully");
            this.isMermaidLoaded = true;
        }).catch(error => {
            console.error("Failed to load Mermaid.js:", error);
        });


    }




    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {

        console.log("control property changed");

        const markdown: string = context.parameters.Markup.raw!
            ? context.parameters.Markup.raw!
            : "";


        const themeId = context.parameters.Theme.raw!
            ? context.parameters.Theme.raw!
            : 0;

        const themeName = this._themeDisplayNames[themeId] as "default" | "base" | "dark" | "forest" | "neutral" | "null";

        const imageSize = context.parameters.ImageStretch.raw!
            ? context.parameters.ImageStretch.raw!
            : 0;


        if (imageSize == "1") {

            this.svgStyleElement.innerHTML = `
                #mermaidCtnr svg {
                    width:100% !important;
                    max-width:100% !important;                
                    }
            `;
        }
        else
            this.svgStyleElement.innerHTML = "";

  

        //this is just for debugging purposes
        const diagramCode = `
            graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;
        `;


        if (markdown.length > 10 && this.isMermaidLoaded) {
            this.renderMermaidDiagram(markdown,themeName);
        }



    }

    private loadMermaidModule(CDNVersion:number): Promise<void> {
        return new Promise((resolve, reject) => {
            
                    
            
            // Create a script tag to load the module
            const script = document.createElement('script');
            script.type = 'module';

           console.log("CDN Version is " + CDNVersion);

            script.textContent = `
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@${CDNVersion}/dist/mermaid.esm.min.mjs'; 
            window.mermaid = mermaid;
            mermaid.initialize({ startOnLoad: false , theme: 'dark' });    
           document.dispatchEvent(new Event('mermaidLoaded'));
            `;

            //this is so know if the module was executed by the browser
            document.addEventListener('mermaidLoaded', () => {
                resolve();
                console.log('Mermaid.js module loaded successfully');
                
            });

            // Attach events to resolve or reject the promise based on load status
            script.onerror = () => reject(new Error("Failed to load Mermaid.js module"));

            // Append the script tag to the head of the document
            document.body.appendChild(script);

        });
    }


    private renderMermaidDiagram(markup: string, theme: string): void {

        
        if (typeof mermaid === 'undefined') {
            console.error("Mermaid library is not available.");
            return;
        }

        //remove this attribute otherwise is doesnt re-render
        this.markupContainer.removeAttribute("data-processed");
        this.markupContainer.innerHTML = markup;

        mermaid.initialize({ startOnLoad: false, theme: theme });
        console.log("rendering diagram");
       
        //find all tags with class of mermaid and change the markup in the tag to SVG image
        mermaid.run({ suppressErrors: true, querySelector: '.mermaid' });


    }



    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
