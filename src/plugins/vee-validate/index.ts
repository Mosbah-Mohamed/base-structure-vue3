import type { App } from 'vue'
import { localize, setLocale } from '@vee-validate/i18n'
import {
  between,
  confirmed,
  email,
  integer,
  max,
  max_value,
  min,
  min_value,
  required,
} from '@vee-validate/rules'
import { Field, Form, configure, defineRule } from 'vee-validate'
import {
  greaterThanTime,
  greaterThanValue,
  isEqual,
  isNumber,
  lessThanTime,
  lessThanValue,
  minDate,
  minWords,
  validIcloud,
  validUrl,
  validVersionNumber,
} from './custom-rules'
import arMessages from './messages/ar'
import enMessages from './messages/en'

function registerGlobalRules() {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('max', max)
  defineRule('validUrl', validUrl)
  defineRule('confirmed', confirmed)
  defineRule('min_value', min_value)
  defineRule('max_value', max_value)
  defineRule('numeric', isNumber)
  defineRule('greaterThanTime', greaterThanTime)
  defineRule('lessThanTime', lessThanTime)
  defineRule('minWords', minWords)
  defineRule('validIcloud', validIcloud)
  defineRule('minDate', minDate)
  defineRule('lessThanValue', lessThanValue)
  defineRule('greaterThanValue', greaterThanValue)
  defineRule('integer', integer)
  defineRule('isEqual', isEqual)
  defineRule('between', between)
  defineRule('validVersionNumber', validVersionNumber)
}

export default {
  install(app: App) {
    registerGlobalRules()

    configure({
      generateMessage: localize({
        en: { messages: enMessages },
        ar: { messages: arMessages },
      }),
    })

    setLocale(localStorage.getItem('app-locale') || 'ar')

    app.component('VeeForm', Form)
    app.component('VeeField', Field)
  },
}
