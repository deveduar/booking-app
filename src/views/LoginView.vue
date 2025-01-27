<template>
  <v-container class="d-flex justify-center align-center fill-height mb-15">
    <v-card class="pa-6" max-width="500" elevation="8" rounded="lg">
      <!-- Logo -->
      <!-- <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img> -->
      <h1 class="text-h4 font-weight-bold text-center mb-4">Sign Up</h1>
      <!-- Formulario de Login -->
      <v-form ref="form" @submit.prevent="handleLogin" v-model="isFormValid">
        <v-text-field
          v-model="form.email"
          label="Email Address"
          type="email"
          outlined
          dense
          :rules="[rules.required, rules.email]"
          required
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>

        <v-text-field
          v-model="form.password"
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

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'LoginView',
  setup() {
    // Estado del formulario
    const form = ref({
      email: '',
      password: '',
    });

    // Estado para la validación del formulario
    const isFormValid = ref(false);

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
      console.log('Logging in user:', form.value);
    };

    // Función para redirigir a la página de registro
    const goToRegister = () => {
      window.location.href = '/register'; // Reemplaza con navegación del router si usas Vue Router
    };

    // Devuelve las propiedades y funciones necesarias para el template
    return {
      form,
      isFormValid,
      rules,
      showPassword,
      togglePasswordVisibility,
      handleLogin,
      goToRegister,
    };
  },
};
</script>



<style scoped>
/* Vuetify components handle most styles; minimal Tailwind usage */
</style>
