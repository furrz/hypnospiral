import * as React from 'react';
import {
    ChangeEvent,
    createContext,
    Fragment,
    HTMLFactory,
    PropsWithChildren,
    ReactElement,
    ReactHTMLElement,
    ReactNode, useContext,
    useId,
    useState
} from "react";
import {Link, NavLink} from "react-router-dom";
import {CaretLeft, Check} from "@phosphor-icons/react";
import {RgbColor, RgbColorPicker} from "react-colorful";
import {colord} from "colord";
import useOnClickOutside from "use-onclickoutside";
import {dyslexiaState} from "./state";

const basicClassComponent = <T, >(clsName: string, cls_calc: (props: PropsWithChildren<T>) => string = (_) => "") =>
    (props: PropsWithChildren<T>) =>
        <div className={clsName + " " + cls_calc(props)}>{props.children}</div>;

export const Page = function ({primary, secondary, children}: PropsWithChildren<{primary?: boolean, secondary?:boolean}>) {
    const [dyslexia, setDyslexia] = dyslexiaState.useState();

    return <div className={"page" + (primary ? " primary" : "") + (secondary ? " secondary" : "") + (dyslexia ? " dyslexia" : "")}>{children}</div>
};

export const BigHeader = basicClassComponent("big_header");
export const FillGap = basicClassComponent("fill_gap");
export const TextBlock = basicClassComponent<{ medium?: boolean }>("inline_text", p => p.medium ? "medium_text" : "");

export const WideButton = ({to, primary, children}: PropsWithChildren<{ to: string, primary?: boolean }>) =>
    <NavLink to={to}
             className={({isActive}) => "wide_button" + (primary ? " primary" : "") + (isActive ? " active" : "")}>
        {children}
    </NavLink>;

export const Breadcrumb = ({to, children, showInBigPrimary}: {
    to: string,
    children: string,
    showInBigPrimary?: boolean
}) => <Fragment>
    {showInBigPrimary || <div className="breadcrumb_space hide_when_not_big_primary"></div>}
    <Link to={to} className={"breadcrumb " + (showInBigPrimary ? "" : "hide_when_big_primary")}><CaretLeft
        weight="fill"/> {children}</Link>
</Fragment>;

export const BreadcrumbSpace = basicClassComponent("breadcrumb_space");

export const Label = function ({value, unit, children, htmlFor, flexExpand}: {
    value?: number,
    unit?: string,
    children: [string, ...ReactElement[]] | string,
    htmlFor?: string,
    flexExpand?: boolean
}) {
    let text: string;
    let extras: ReactElement[] = [];
    let labelClasses = "";
    if (flexExpand) {
        labelClasses += " flex_expand";
    }
    if (typeof children === 'string') {
        text = children;
        labelClasses += " separate_input";
    } else {
        [text, ...extras] = children;
    }

    return <label htmlFor={htmlFor} className={labelClasses}>
        <div className={"label_row"}>
            <span>{text}</span>
            <span>
                {(value != undefined) ? value.toFixed(2) : ""}
                <span className="label_unit">{unit ?? ""}</span>
            </span>
        </div>
        <div className={"input_row " + (flexExpand ? " flex_expand" : "")}>
            {...extras}
        </div>
    </label>
};

export const Slider = function ({min = 0, max = 1, step = 0.01, value, onChange, id}: {
    min?: number,
    max?: number,
    step?: number,
    value?: number,
    onChange?: (_: number) => void,
    id?: string
}) {
    let percent = (value - min) / (max - min) * 100;
    return <input type="range" min={min} max={max} step={step} value={value} id={id}
                  style={{background: "linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) " + percent + "%, var(--input-color) " + percent + "%, var(--input-color) 100%)"}}
                  onChange={e => onChange && onChange(e.target.valueAsNumber)}/>
};

export const TextBox = function ({placeholder, value, onChange, id}: {
    placeholder?: string,
    value?: string,
    onChange?: (_: string) => void,
    id?: string
}) {
    return <input type="text" placeholder={placeholder} value={value} id={id}
                  onChange={e => onChange && onChange(e.target.value)}/>;
};

export const TextArea = function ({placeholder, value, onChange, id}: {
    placeholder?: string,
    value?: string,
    onChange?: (_: string) => void,
    id?: string
}) {
    return <textarea placeholder={placeholder} value={value} id={id}
                     onChange={e => onChange && onChange(e.target.value)}></textarea>;
};

export const Checkbox = function ({children, value, onChange, id}: {
    children: string,
    value?: boolean,
    onChange: (_: boolean) => void,
    id?: string
}) {
    return <Fragment>
        <label className="check_label">
            <span>{children}</span>
            <input type="checkbox" checked={value} id={id}
                   onChange={e => onChange && onChange(e.target.checked)}/>
            <div className="checkbox"><Check weight="bold"/></div>
        </label>
    </Fragment>;
};

const RadioParamsContext = createContext({
    name: "",
    value: "",
    onChange: (_: string) => {
    }
});

export const Radio = function ({children, value, onChange}: PropsWithChildren<{
    value: string,
    onChange: (_: string) => void
}>) {
    let name = useId();

    return <RadioParamsContext.Provider value={{
        name, value, onChange
    }}>
        {children}
    </RadioParamsContext.Provider>;
}

export const RadioOption = function ({value, children}: PropsWithChildren<{
    value: string
}>) {
    let radioParams = useContext(RadioParamsContext);
    let id = useId();

    return <Fragment>
        <input type="radio"
               name={radioParams.name}
               value={value} id={id}
               checked={radioParams.value === value}
               onChange={e => radioParams.onChange(e.target.value)}/>
        <label htmlFor={id}>{children}</label>
    </Fragment>;
}

export const ColourBox = function ({value, onChange}: {
    value: RgbColor,
    onChange?: (_: RgbColor) => void
}) {
    const [isOpen, setIsOpen] = useState(false);

    const ref = React.useRef(null);
    useOnClickOutside(ref, () => {
        setIsOpen(false);
    });

    return <Fragment>
        <div className={"colour_box " + (isOpen ? "active" : "")} style={{backgroundColor: colord(value).toRgbString()}}
             onClick={() => setIsOpen(true)}></div>
        <div className={"popover_darken " + (isOpen ? "active" : "")}></div>
        {isOpen && (
            <div className="colour_popover" ref={ref}>
                <RgbColorPicker color={value} onChange={onChange}/>
            </div>
        )}
    </Fragment>;
}
