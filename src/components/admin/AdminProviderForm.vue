<template>
  <v-card class="mt-6 d-flex flex-column" style="max-height: 90vh;">
    <v-card-title class="d-flex align-center justify-space-between flex-shrink-0 " style="position: sticky; top: 0; z-index: 10;">
      {{ editingId ? 'Edit Specialist' : 'Add New Specialist' }}
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('cancel')" />
    </v-card-title>
    <v-card-text class="flex-grow-1 overflow-y-auto">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="internalName" label="Specialist Name" :rules="[v => !!v || 'Name is required']" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="internalDescription" label="Description" rows="2" placeholder="Brief bio..." />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="internalStatus" :items="['Available', 'Busy', 'Away']" label="Status" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="internalImage" label="Avatar URL (Optional)" placeholder="https://..." />
          </v-col>
          <v-col cols="12" class="mt-n2">
            <v-switch
              v-model="internalIsFeatured"
              label="Featured Expert (Show on Home Page)"
              color="amber"
              hide-details
              density="compact"
            />
          </v-col>
          <v-col cols="12" class="d-flex">
            <v-btn
              color="secondary"
              variant="elevated"
              type="submit"
              class="flex-grow-1"
              :disabled="isSaveDisabled"
            >
              {{ editingId ? 'Update Specialist' : 'Add Specialist' }}
            </v-btn>
            <v-btn color="error" variant="text" class="ml-2" @click="$emit('cancel')">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Provider } from '@/stores/providers'

// Minimal interface for VForm validation
type VForm = {
  validate: () => Promise<{ valid: boolean }>;
  reset: () => void;
  resetValidation: () => void;
}

const props = defineProps<{
  name: string;
  description?: string;
  status: string;
  image: string;
  isFeatured: boolean;
  providers: Provider[];
  editingId?: number | null;
  isDirty?: boolean;
}>();

const emit = defineEmits(['update:name', 'update:description', 'update:status', 'update:image', 'update:isFeatured', 'save', 'cancel', 'remove', 'edit']);

const formRef = ref<VForm | null>(null);

const internalName = computed({ get: () => props.name, set: v => emit('update:name', v) });
const internalDescription = computed({ get: () => props.description || '', set: v => emit('update:description', v) });
const internalStatus = computed({ get: () => props.status, set: v => emit('update:status', v) });
const internalImage = computed({ get: () => props.image, set: v => emit('update:image', v) });
const internalIsFeatured = computed({ get: () => props.isFeatured, set: v => emit('update:isFeatured', v) });

const isSaveDisabled = computed(() => {
  // If editing, disable save until changes are made (isDirty is true)
  if (props.editingId !== null && props.editingId !== undefined) {
    return !props.isDirty;
  }
  // If adding, always enabled (or could check validation)
  return false;
});

function handleSubmit() {
  emit('save')
}

defineExpose({
  validate: () => formRef.value?.validate(),
  resetValidation: () => formRef.value?.resetValidation()
});
</script>
