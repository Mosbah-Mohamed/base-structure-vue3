export interface FormInputProps {
  modelValue: unknown
  name: string
  rules?: string | Record<string, unknown>
  hideDefaultLabel?: boolean
  hideLabel?: boolean
  label?: string
}

export interface FormSelectProps extends FormInputProps {
  options: Array<{ label: string; value: string | number | boolean }>
}

export interface FormSwitchProps extends FormInputProps {
  label?: string
}

export type FormActionType = 'create' | 'edit' | 'delete' | 'view'

export interface FormModalProps {
  showModal: boolean
  activeItem?: unknown
  formAction?: FormActionType
}
