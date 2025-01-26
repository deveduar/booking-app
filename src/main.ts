// import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VTimePicker } from 'vuetify/labs/VTimePicker'


const vuetify = createVuetify({
    components: {
        VDateInput, 
        VTimePicker,
      },
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      }
    },
    theme: {
      defaultTheme: 'dark', // Puedes definir temas personalizados
      themes: {
        light: {
          colors: {
            primary: '#607AFB', // Color principal (botón y switch)
            background: '#F9FAFA', // Fondo principal
            'on-background': '#1C1D22', // Texto principal
            'on-surface': '#3C3F4A', // Texto secundario
          },
        },
        dark: {
        colors: {
            primary: '#607AFB', // Color principal (botón y switch)
            background: '#1C1D22', // Fondo principal
            surface: '#3C3F4A', // Fondo de elementos secundarios
            'on-background': '#F9FAFA', // Texto principal
            'on-surface': '#D5D6DD', // Texto secundario
        },
        },
      },
    },
  })



import App from '@/App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(vuetify).use(router)

app.mount('#app')
