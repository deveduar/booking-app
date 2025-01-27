<template>
  <v-container class="d-flex justify-center align-center fill-height mb-15">
    <v-card class="pa-6" max-width="500" elevation="8" rounded="lg">
      <!-- Logo -->
      <!-- <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img> -->
      <!-- Título -->
      <h1 class="text-h4 font-weight-bold text-center mb-4">Sign In</h1>
      
      <!-- Formulario de Registro -->
      <v-form ref="form" @submit.prevent="handleRegister" v-model="isFormValid">
        <v-text-field
          v-model="form.fullName"
          label="Full Name"
          outlined
          dense
          :rules="[rules.required]"
          required
          prepend-inner-icon="mdi-account-outline"
        ></v-text-field>

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
          :rules="[rules.required, rules.password]"
          required
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>

        <v-text-field
          v-model="form.confirmPassword"
          label="Confirm Password"
          type="password"
          outlined
          dense
          :rules="[rules.required, passwordsMatch]"
          required
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>

        <!-- Mensaje de advertencia (opcional) -->
        <v-card class="mb-4 mt-4" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: Please make sure your password matches and meets the required criteria.
          </v-card-text>
        </v-card>

        <!-- Botón de Registro -->
        <v-btn
          color="primary"
          block
          class="mt-4"
          :disabled="!isFormValid"
          type="submit"
        >
          Register
        </v-btn>
      </v-form>

      <!-- Enlace a Login -->
      <p class="text-caption text-center mt-4">
        Already have an account?
        <a @click="goToLogin" class="text-primary cursor-pointer">
          Login here
        </a>
      </p>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'RegisterView',
  setup() {
    // Estado del formulario
    const form = ref({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Estado para la validación del formulario
    const isFormValid = ref(false);

    // Reglas de validación
    const rules = {
      required: (value: string) => !!value || 'This field is required',
      email: (value: string) =>
        /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email',
      password: (value: string) =>
        value.length >= 6 || 'Password must be at least 6 characters long',
    };

    const passwordsMatch = () =>
      form.value.password === form.value.confirmPassword ||
      'Passwords must match';

    // Estado para mostrar/ocultar la contraseña
    const showPassword = ref(false);

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    // Función para manejar el registro
    const handleRegister = () => {
      console.log('Registering user:', form.value);
    };

    // Función para redirigir a la página de login
    const goToLogin = () => {
      window.location.href = '/login'; // Reemplaza con navegación del router
    };

    // Devuelve las propiedades y funciones necesarias para el template
    return {
      form,
      isFormValid,
      rules,
      passwordsMatch,
      showPassword,
      togglePasswordVisibility,
      handleRegister,
      goToLogin,
    };
  },
};
</script>


<style scoped>
/* Vuetify components handle most styles; minimal Tailwind usage */
</style>
