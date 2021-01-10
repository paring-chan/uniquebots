import Select, { Props } from 'react-select'
import AsyncSelect, { AsyncProps } from 'react-select/async'
import SelectContainer from './SelectContainer'
import SelectControl from './SelectControl'
import SelectSingleValue from './SelectSingleValue'
import SelectMultiValue from './SelectMultiValue'
import SelectOption from './SelectOption'

const UBSelect = (
  props: Props<any, any> | (AsyncProps<any> & { async?: boolean }),
) => {
  const Component = props.async ? AsyncSelect : Select

  return (
    // @ts-ignore
    <Component
      {...props}
      components={{
        Option: SelectOption,
        SelectContainer: SelectContainer,
        Control: SelectControl,
        MultiValue: SelectMultiValue,
        SingleValue: SelectSingleValue,
      }}
    />
  )
}

export default UBSelect
