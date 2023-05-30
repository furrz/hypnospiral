import {createState} from 'state-pool';

let hashState : any = {};

export const onHashStateUpdate = debounce(() => {
    if (Object.keys(hashState).length > 0) {
        history.replaceState(undefined, undefined, "#" + encodeURIComponent(JSON.stringify(hashState)));
    } else {
        history.replaceState(undefined, undefined, "#");
    }
});

function debounce(func: (..._: any) => void, timeout = 100) {
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

if (location.hash && location.hash.length > 2) {
    try {
        // If it loads, change all the relevant state values.
        hashState = { ...JSON.parse(decodeURIComponent(location.hash.substring(1))) };
    } catch (e) {
        console.log(e);
    }
}

const createHashState = <T>(name: string, defaultValue: T) => {
    let state = createState(JSON.parse(JSON.stringify((hashState[name] !== undefined) ? hashState[name] : defaultValue)));

    return () => {
        let [value, setValue] = state.useState();

        return [value as T, (newValue: T) => {
            setValue(newValue);
            if (JSON.stringify(newValue) !== JSON.stringify(defaultValue)) {
                hashState[name] = newValue;
            } else {
                delete hashState[name];
            }
            onHashStateUpdate();
        }] as [T, (_: T) => void];
    };
};

export let useBgColor = createHashState("bgColor", {r: 0, g: 0, b: 0});
export let useFgColor = createHashState("spColor", {r: 96, g: 255, b: 43});
export let useTxtColor = createHashState("txtColor", {r: 255, g: 255, b: 255});
export let useSpinSpeed = createHashState("spinSpeed", 1);
export let useThrobSpeed = createHashState("throbSpeed", 1);
export let useThrobStrength = createHashState("throbStrength", 1);
export let useZoom = createHashState("zoom", 1);
export let useMessages = createHashState("messages", [] as string[]);
export let useMessageAlpha = createHashState("messageAlpha", 0.25);
export let useMessageDuration = createHashState("messageDuration", 0.1);
export let useMessageGap = createHashState("messageGap", 1);
export let useOneWord = createHashState("oneWord", true);
export let useRandomOrder = createHashState("randomOrder", true);
export let useBgImage = createHashState("bgImage", "");
export let useBgImageAlpha = createHashState("bgImageAlpha", 0.5);
export let useTextWall = createHashState("textWall", true);
export let useCutomGoogleFont = createHashState("customGoogleFont", "");
export let useSpiralMode = createHashState("spiralMode", "spiral");

export let dyslexiaState = createState(!!localStorage.getItem('dyslexic'));
