<template>
  <v-dialog v-model="internalOpen" max-width="500">
    <v-card>
      <v-toolbar color="error" density="compact">
        <v-toolbar-title class="text-h6 text-white">
          Delete Specialist
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" @click="close"></v-btn>
      </v-toolbar>
      
      <v-card-text class="pt-4">
        <p class="mb-4 text-body-1">
          Are you sure you want to delete <strong>{{ providerName }}</strong>?
        </p>
        <p class="text-caption text-grey mb-4">This action cannot be undone.</p>
        
        <v-alert
          v-if="conflicts.length > 0"
          type="warning"
          variant="tonal"
          class="mb-4"
          icon="mdi-alert-circle"
          border="start"
        >
          <div class="text-subtitle-2 font-weight-bold mb-1">Override Conflicts Detected</div>
          <div class="text-body-2 mb-2">
            Deleting this specialist will leave the following services with only <strong>one</strong> assigned specialist who has active <strong>Overrides</strong> (custom schedule).
          </div>
          <ul class="ml-4 text-caption mb-2">
            <li v-for="c in conflicts" :key="c.serviceId">
              {{ c.serviceName }} (Survivor: <strong>{{ c.survivorName }}</strong>)
            </li>
          </ul>
        </v-alert>

        <div v-if="conflicts.length > 0" class="mt-4 pa-3  rounded">
          <div class="text-subtitle-2 mb-2 font-weight-bold">Resolution Action</div>
          <div class="text-caption mb-2">How should we handle the survivor's overrides?</div>
          <v-radio-group v-model="resolutionAction" density="compact" hide-details>
            <v-radio value="remove" label="Remove Overrides (Use Default Service Schedule)" color="primary" />
            <v-radio value="promote" label="Promote Override to Service Default (Overwrite Global)" color="primary" />
          </v-radio-group>
          <div v-if="resolutionAction === 'promote'" class="text-caption text-info mt-2 ml-2 d-flex align-center">
            <v-icon icon="mdi-information" size="small" class="mr-1" />
            Updates global service schedule with survivor's custom dates/times.
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="close">Cancel</v-btn>
        <v-btn color="error" variant="elevated" @click="confirm" prepend-icon="mdi-delete">
          Confirm Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean;
  providerName: string;
  conflicts: { serviceId: number; serviceName: string; survivorId: number; survivorName: string }[];
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const resolutionAction = ref<'remove' | 'promote'>('remove');

// Reset when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resolutionAction.value = 'remove';
  }
});

function close() {
  internalOpen.value = false;
}

function confirm() {
  emit('confirm', resolutionAction.value);
  close();
}
</script>
