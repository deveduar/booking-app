<template>
  <v-container  class="d-flex justify-center align-center fill-height ">
    <v-card class="pa-6" max-width="500" elevation="5" rounded="lg">
      <!-- Logo -->
      <!-- <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img> -->
      <h1 class="text-h4 font-weight-bold text-center mb-4">Sign In</h1>
      <!-- Formulario de Login -->
      <v-form ref="form" @submit.prevent="handleLogin" v-model="isFormValid">
        <v-alert
          v-if="loginError"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          Invalid email or password.
        </v-alert>
        <v-text-field
          v-model="loginForm.email"
          label="Email Address"
          type="email"
          outlined
          dense
          :rules="[rules.required, rules.email]"
          required
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>

        <v-text-field
          v-model="loginForm.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          dense
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="togglePasswordVisibility"
          :rules="[rules.required]"
          required
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>

        <!-- Mensaje de advertencia -->
        <v-card class="mb-4 mt-4" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, your account will be temporarily locked for three hours. You can also reset your password by clicking "Forgot login password?".
          </v-card-text>
        </v-card>

        <!-- Botón de Login -->
        <v-btn
          color="primary"
          block
          class="mt-4"
          :disabled="!isFormValid"
          type="submit"
        >
          Log in
        </v-btn>
      </v-form>

      <!-- Enlace a registro -->
      <p class="text-caption text-center mt-4">
        Don’t have an account?
        <a @click="goToRegister" class="text-primary cursor-pointer">
          Register here
        </a>
      </p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Estado del formulario
const loginForm = ref({
  email: '',
  password: '',
});

// Estado para la validación del formulario
const isFormValid = ref(false);
const loginError = ref(false);

// Reglas de validación
const rules = {
  required: (value: string) => !!value || 'This field is required',
  email: (value: string) =>
    /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email',
};

// Estado para mostrar/ocultar la contraseña
const showPassword = ref(false);

// Función para alternar la visibilidad de la contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Función para manejar el login
const handleLogin = () => {
  loginError.value = false;
  const success = authStore.login(loginForm.value.email, loginForm.value.password);
  
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/';
    router.push(redirectPath);
  } else {
    loginError.value = true;
  }
};

// Función para redirigir a la página de registro
const goToRegister = () => {
  router.push('/register');
};
</script>



<style scoped>
/* Vuetify components handle most styles; minimal Tailwind usage */
</style>
