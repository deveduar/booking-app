// import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const myCustomLightTheme = {
    dark: false,
    colors: {
      background: '#F9FAFA',
      surface: '#EEEFF2',
      primary: '#607AFB',
      secondary: '#48A9A6',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
  };
  
  const myCustomDarkTheme = {
    dark: true,
    colors: {
      background: '#1C1D22',
      surface: '#3C3F4A',
      primary: '#607AFB',
      secondary: '#48A9A6',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
  };

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

const app = createApp(App)
const pinia = createPinia()

app.use(pinia,).use(vuetify)

app.mount('#app')
