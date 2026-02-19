<template>
  <v-card class="mt-6">
    <v-card-title>Add New Specialist</v-card-title>
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="$emit('add')">
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="internalName" label="Specialist Name" :rules="[v => !!v || 'Name is required']" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="internalStatus" :items="['Available', 'Busy', 'Away']" label="Initial Status" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="internalImage" label="Avatar URL (Optional)" placeholder="https://..." />
          </v-col>
          <v-col cols="12">
            <v-btn block color="secondary" variant="elevated" type="submit">
              Add Specialist
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      
      <v-divider class="my-4"></v-divider>
      
      <v-list density="compact">
        <v-list-item v-for="prov in providers" :key="prov.id" :title="prov.name" :subtitle="prov.status">
          <template #prepend>
            <v-avatar size="32" class="mr-2">
              <v-img v-if="prov.image" :src="prov.image" />
              <v-icon v-else color="grey">mdi-account</v-icon>
            </v-avatar>
          </template>
          <template #append>
            <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="$emit('remove', prov.id)" />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  name: string;
  status: string;
  image: string;
  providers: any[];
}>();

const emit = defineEmits(['update:name', 'update:status', 'update:image', 'add', 'remove']);

const formRef = ref<any>(null);

const internalName = computed({ get: () => props.name, set: v => emit('update:name', v) });
const internalStatus = computed({ get: () => props.status, set: v => emit('update:status', v) });
const internalImage = computed({ get: () => props.image, set: v => emit('update:image', v) });

defineExpose({
  validate: () => formRef.value.validate(),
  resetValidation: () => formRef.value.resetValidation()
});
</script>
