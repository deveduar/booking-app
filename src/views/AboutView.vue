<template>
      <v-container >
        <!-- Banner de Introducción -->
        <v-row>
            <v-col cols="12" class="flex items-center justify-center ">
                <v-card class="mx-auto" max-width="100%">
                    <v-img
                    class="align-end text-white"
                    height="400px"
                    src="https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    cover
                    >
                    <div
          style="
            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            padding: 16px;
            position: absolute;
            bottom: 0;"
        >
          <v-card-title class="font-weight-bold text-h4 text-white">
            About Our Platform
          </v-card-title>
          <v-card-subtitle class=" text-h5 text-white">
            We help businesses of all types manage services and accept bookings online.
          </v-card-subtitle>
        </div>
                    </v-img>
                </v-card>
            </v-col>
            </v-row>

  
        <!-- Sección Historia -->
        <v-row class="py-5">
          <v-col cols="12">
            <h2 class="text-h5 font-weight-bold">Our Story</h2>
            <p>Founded in 2014, our platform started as a simple appointment tool and evolved into a flexible booking system used by salons, clinics, trainers, consultants, and more. Our mission is to simplify scheduling so businesses can focus on delivering great service.</p>
          </v-col>
        </v-row>
  
        <!-- Equipo -->
        <v-row class="py-5">
          <v-col v-for="member in team" :key="member.name" cols="12" md="4" class="text-center">
            <v-img :src="member.photo" height="200px" class="mb-4" contain />
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </v-col>
        </v-row>
  
        <!-- Misión -->
        <v-row class="py-5">
          <v-col cols="12">
            <h2 class="text-h5 font-weight-bold">Our Mission</h2>
            <p>We believe booking should be effortless—for providers and customers. We deliver tools to publish services, manage availability, and communicate with clients in one place.</p>
          </v-col>
        </v-row>
  
        <!-- Testimonios -->
        <v-row class="py-5">
          <v-col v-for="testimonial in testimonials" :key="testimonial.name" cols="12" md="4" class="d-flex justify-center">
            <v-card class="mx-4" max-width="400">
              <v-img :src="testimonial.avatar" height="100px" class="rounded-circle" />
              <v-card-title>{{ testimonial.name }}</v-card-title>
              <v-card-subtitle class="text-h6">{{ testimonial.role }}</v-card-subtitle>
              <v-card-text>{{ testimonial.comment }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </template>
  
  <script lang="ts">
  export default {
    data() {
      return {
        team: [
          { name: 'Dennis Mueller', role: 'Founder', photo: 'https://cdn.usegalileo.ai/sdxl10/d29d5c77-4825-47b1-bd5c-c2687b1a8188.png' },
          { name: 'Giulia Camargo', role: 'Founder', photo: 'https://cdn.usegalileo.ai/sdxl10/4b3003fb-e0e5-4dc8-b0ce-00b7cd277925.png' },
          { name: 'Kelsey Deenihan', role: 'Co-Founder', photo: 'https://cdn.usegalileo.ai/sdxl10/3cfcffb1-11fa-4070-a3e8-e84e285b9343.png' },
        ],
        testimonials: [
          { name: 'John Doe', role: 'Business Owner', avatar: 'https://cdn.usegalileo.ai/sdxl10/858083b2-aa0f-4fb3-aa9a-789ee1d4e3fe.png', comment: 'Managing bookings is now effortless for our team.' },
          { name: 'Jane Smith', role: 'Customer', avatar: 'https://cdn.usegalileo.ai/replicate/44054395-3f26-4fc6-b930-e2ca89e11e0c.png', comment: 'Booking online is quick and reliable—highly recommend!' },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  
