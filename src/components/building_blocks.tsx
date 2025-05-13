import * as React from 'react'
import { createContext, Fragment, type PropsWithChildren, type ReactElement, useContext, useId, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CaretLeft, Check } from '@phosphor-icons/react'
import { type RgbColor, RgbColorPicker } from 'react-colorful'
import { colord } from 'colord'
import useOnClickOutside from 'use-onclickoutside'
import classNames from 'classnames'
import { useDyslexiaState } from 'dyslexia'

type ClassNamesFromProps<T> = (props: PropsWithChildren<T>) => string
const returnsEmptyString = () => ''

function divWithClassesComponent<T> (clsName: string, clsCalc: ClassNamesFromProps<T> = returnsEmptyString) {
  return function WrappedClassComponent (props: PropsWithChildren<T>) {
    return <div className={clsName + ' ' + clsCalc(props)}>{props.children}</div>
  }
}

export const Page = function ({ primary, secondary, children }: PropsWithChildren<{
  primary?: boolean
  secondary?: boolean
}>) {
  const [dyslexia] = useDyslexiaState()
  return <div className={classNames('page', {
    primary,
    secondary,
    dyslexia
  })}>{children}</div>
}

export const BigHeader = divWithClassesComponent('big_header')
export const FillGap = divWithClassesComponent('fill_gap')
export const TextBlock = divWithClassesComponent<{
  medium?: boolean
}>('inline_text', p => classNames({ medium_text: p.medium }))

export const WideButton = ({ to, primary, children, onSecondaryPage = false }: PropsWithChildren<{
  to: string
  primary?: boolean
  onSecondaryPage?: boolean
}>) => {
  const navigate = useNavigate()
  return <NavLink to={to}
                  onClick={onSecondaryPage
                    ? () => { navigate(-1) }
                    : undefined}
                  className={({ isActive }) => classNames('wide_button', { primary, active: isActive })}>
    {children}
  </NavLink>
}

export const Breadcrumb = ({ children, showInBigPrimary = false, secondary = false }: {
  children: string
  showInBigPrimary?: boolean
  secondary?: boolean
}) => {
  const navigate = useNavigate()

  return <Fragment>
    {showInBigPrimary || <div className="breadcrumb_space hide_when_not_big_primary"></div>}
    <a href="#" onClick={e => {
      navigate(secondary ? -2 : -1)
      e.preventDefault()
    }} className={classNames('breadcrumb', { hide_when_big_primary: !showInBigPrimary })}>
      <CaretLeft weight="fill"/> {children}
    </a>
  </Fragment>
}

export const BreadcrumbSpace = divWithClassesComponent('breadcrumb_space')

export const Label = function ({ value, unit, children, htmlFor, flexExpand }: {
  value?: any
  unit?: string
  children: [string, ...ReactElement[]] | string
  htmlFor?: string
  flexExpand?: boolean
}) {
  let text: string
  let extras: ReactElement[] = []
  const isLabelOnly = typeof children === 'string'

  if (isLabelOnly) {
    text = children
  } else {
    [text, ...extras] = children
  }

  return <label htmlFor={htmlFor} className={classNames({
    flex_expand: flexExpand,
    separate_input: isLabelOnly
  })}>
    <div className="label_row">
      <span>{text}</span>
      <span>
                {(value !== undefined) ? ((typeof value === 'number') ? value.toFixed(2) : value) : ''}
        <span className="label_unit">{unit ?? ''}</span>
            </span>
    </div>
    <div className={classNames('input_row', { flex_expand: flexExpand })}>
      {...extras}
    </div>
  </label>
}

export const Slider = function ({ min = 0, max = 1, step = 0.01, value, onChange, id }: {
  min?: number
  max?: number
  step?: number
  value: number
  onChange?: (_: number) => void
  id?: string
}) {
  const percent = (value - min) / (max - min) * 100
  return <input type="range" min={min} max={max} step={step} value={value} id={id}
                style={{
                  background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percent}%, var(--input-color) ${percent}%, var(--input-color) 100%)`
                }}
                onChange={e => { onChange?.(e.target.valueAsNumber) }}/>
}

export const TextBox = function ({ placeholder, value, onChange, id }: {
  placeholder?: string
  value?: string
  onChange?: (_: string) => void
  id?: string
}) {
  return <input type="text" placeholder={placeholder} value={value} id={id}
                onChange={e => { onChange?.(e.target.value) }}/>
}

export const TextArea = function ({ placeholder, value, onChange, id }: {
  placeholder?: string
  value?: string
  onChange?: (_: string) => void
  id?: string
}) {
  return <textarea placeholder={placeholder} value={value} id={id}
                   onChange={e => { onChange?.(e.target.value) }}></textarea>
}

export const Checkbox = function ({ children, value, onChange, id }: {
  children: string
  value?: boolean
  onChange: (_: boolean) => void
  id?: string
}) {
  return <Fragment>
    <label className="check_label" role="checkbox" aria-checked={value} tabIndex={0}>
      <span>{children}</span>
      <input type="checkbox" checked={value} id={id}
             onChange={e => { onChange?.(e.target.checked) }}/>
      <div className="checkbox"><Check weight="bold"/></div>
    </label>
  </Fragment>
}

const RadioParamsContext = createContext({
  name: '',
  value: '',
  onChange: (_: string) => {
  }
})

export const Radio = function ({ children, value, onChange }: PropsWithChildren<{
  value: string
  onChange: (_: string) => void
}>) {
  const name = useId()

  return <RadioParamsContext.Provider value={{
    name, value, onChange
  }}>
    {children}
  </RadioParamsContext.Provider>
}

export const RadioOption = function ({ value, label, children }: PropsWithChildren<{
  value: string
  label: string
}>) {
  const radioParams = useContext(RadioParamsContext)
  const id = useId()

  return <Fragment>
    <input type="radio"
           name={radioParams.name}
           aria-label={label}
           value={value} id={id}
           checked={radioParams.value === value}
           onChange={e => { radioParams.onChange(e.target.value) }}/>
    <label htmlFor={id}>{children}</label>
  </Fragment>
}

export const ColourBox = function ({ value, onChange }: {
  value: RgbColor
  onChange?: (_: RgbColor) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const ref = React.useRef(null)
  useOnClickOutside(ref, () => {
    setIsOpen(false)
  })

  return <Fragment>
    <div className={classNames('colour_box', { active: isOpen })}
         style={{ backgroundColor: colord(value).toRgbString() }}
         onClick={() => { setIsOpen(true) }}></div>
    <div className={classNames('popover_darken', { active: isOpen })}></div>
    {isOpen && (
      <div className="colour_popover" ref={ref}>
        <RgbColorPicker color={value} onChange={onChange}/>
      </div>
    )}
  </Fragment>
}
