import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import CurrencyConverter from '../CurrencyConverter.vue'

describe('CurrencyConverter', () => {
  it('renders properly', () => {
    const wrapper = mount(CurrencyConverter, { props: { title: 'Test' } })
    expect(wrapper.text()).toContain('Test')
  })
})
