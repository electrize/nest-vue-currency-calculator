<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Currency {
  code: string
}

const generalError = 'Error occured'

const source = ref<string>('EUR')
const target = ref<string>('')
const amount = ref<string>('1')
const result = ref<string>('?')
const currencies = ref<Currency[]>([])

const getToken = async () => {
  try {
    const response = await axios.get('/csrf-token')
    return response.data
  } catch (error) {
    alert(generalError)
  }
}

const handleSubmit = async () => {
  if (!amount.value || amount.value == '') return
  if (!source.value || source.value == '') return
  if (!target.value || target.value == '') return
  const formData = {
    source: source.value,
    target: target.value,
    amount: amount.value
  }
  const token = await getToken()

  try {
    const response = await axios.post('/api/currencies/convert', formData, {
      headers: {
        'Content-Type': 'application/json',
        _csrf: token
      }
    })
    result.value = response.data.localeQuote
  } catch (error) {
    alert(generalError)
  }
}

const getCurrancies = async () => {
  const token = await getToken()
  try {
    const response = await axios.get('/api/currencies/list', {
      headers: {
        _csrf: token
      }
    })
    return (currencies.value = response.data)
  } catch (error) {
    alert(generalError)
  }
}
getCurrancies()
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="result-container">
      <div class="form-group">
        <label> Amount:</label>
        <input type="number" min="0" max="100000000" v-model="amount" @input="handleSubmit" />
      </div>
      <div class="form-group">
        <label> Source:</label>
        <select v-model="source" disabled @change="handleSubmit">
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div class="form-group">
        <label> Target:</label>
        <select v-model="target" @change="handleSubmit">
          <option v-for="currency in currencies" :key="currency.code">{{ currency.code }}</option>
        </select>
      </div>
    </div>
    <div class="result">
      {{ amount }} {{ source }} <small>to</small> {{ target || '?' }} <small>=</small>
      {{ result || '?' }}
    </div>
  </form>
</template>

<style scoped>
.result-container {
  display: flex;
  align-items: center;
}
.result {
  flex: 1 1 auto;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
small {
  font-variant: small-caps;
}
form {
  background-color: rgb(52 73 94);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  color: white;
}
.form-group {
  flex: 1 33%;
  margin: 0 5px;
}
label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}
input,
select {
  width: 100%;

  height: 40px;
  background-color: white;
  border-radius: 5px;
  border: none;
  padding: 0 20px;
  outline: none;
  font-weight: bold;
  font-size: 18px;
  &:focus {
    box-shadow: 0 0 0 3px var(--color-green);
  }
}
input {
  padding: 0 20px;
}
</style>
