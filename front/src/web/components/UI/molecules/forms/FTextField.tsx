import { useController, useFormContext } from "react-hook-form"
import STextField from "../../atom/STextField"
import Flex from "../../../../style/Flex"
import styled from "styled-components"
import Label from "../../atom/Label"

interface FTextFieldProps {
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean
  noLabel?: boolean
}

const FTextField = ({
  name,
  label,
  placeholder,
  disabled,
  noLabel = false,
}: FTextFieldProps) => {
  const { control } = useFormContext()

  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "",
  })

  return (
    <Flex direction="column" gap={0.5}>
      {!noLabel && <Label>{label ?? name}</Label>}
      <STextField
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        disabled={disabled}
        inputRef={ref}
        {...inputProps}
      />
    </Flex>
  )
}

export default FTextField
