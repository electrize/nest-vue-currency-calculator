<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import axios, { AxiosError } from 'axios'

import Dropdown from './form/Dropdown.vue'
import Group from './form/Group.vue'
import Message from './form/Message.vue'

const generalError = 'Something is wrong'
const error = ref<string>('')

const source = ref<string>('EUR')
const target = ref<string>('')
const amount = ref<string>('')
const result = ref<string>('?')

const currencies = ref<[]>([])

watchEffect(() => {
  const amountValue = Number(amount.value)
  if (isNaN(amountValue) || amountValue <= 0) {
    amount.value = ''
  }
})

const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await axios.get<string>('/api/csrf-token')

    return response.data
  } catch {
    error.value = generalError
  }

  return ''
}

const convert = async () => {
  error.value = ''

  const amountString = amount.value
  const sourceCode = source.value
  const targetCode = target.value

  if (!amountString || !Number(amountString) || Number(amountString) <= 0) {
    return (error.value = 'Please, fill in amount greater than 0')
  }
  if (!sourceCode) {
    return (error.value = 'Please, select Source currency.')
  }
  if (!targetCode) {
    return (error.value = 'Please, select Target currency.')
  }

  const csrfToken = await fetchCsrfToken()

  try {
    const response = await axios.post(
      '/api/currencies/convert',
      {
        source: sourceCode,
        target: targetCode,
        amount: Number(amountString)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken
        }
      }
    )

    result.value = response.data.localeQuote
  } catch (err: AxiosError | unknown) {
    if (axios.isAxiosError(err) && err.response && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = generalError
    }
  }
}

const fetchCurrencies = async (): Promise<void> => {
  const csrfToken = await fetchCsrfToken()

  try {
    const { data } = await axios.get('/api/currencies/list', {
      headers: {
        'csrf-token': csrfToken
      }
    })

    currencies.value = data
  } catch {
    error.value = generalError
  }
}
fetchCurrencies()
</script>

<template>
  <form @submit.prevent="convert">
    <Group name="Amount:">
      <input type="number" min="0" v-model="amount" @input="convert" />
    </Group>
    <Group name="Source:">
      <Dropdown
        :onChange="convert"
        :options="currencies"
        optionKey="code"
        optionValue="code"
        v-model="source"
      />
    </Group>
    <Group name="Target:">
      <Dropdown
        :onChange="convert"
        :options="currencies"
        optionKey="code"
        optionValue="code"
        v-model="target"
      />
    </Group>
  </form>
  <Message type="error">{{ error }}</Message>

  <Message class="result" v-if="!error">
    {{ amount }} {{ source }} <small>to</small> {{ target || '?' }} <small>=</small>
    {{ result || '?' }}
  </Message>
</template>

<style scoped>
form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.form-group {
  flex: 1 1 33%;
  padding: 0 0.5rem;
}
@media (max-width: 1023px) {
  .form-group {
    flex: 1 1 100%;
  }
}
.result {
  font-size: 2rem;
  font-weight: bold;
}
small {
  font-variant: small-caps;
}
</style>
