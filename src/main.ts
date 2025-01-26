import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      }
    },
    theme: {
      defaultTheme: 'light', // Puedes definir temas personalizados
      themes: {
        light: {
          colors: {
            primary: '#607AFB', // Color principal (botón y switch)
            background: '#F9FAFA', // Fondo principal
          },
        },
      },
    },
  })



import App from '@/App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia,).use(vuetify)

app.mount('#app')
