<script lang="ts" setup>
const isOpen = ref(true);

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const modalTitleId = `modal-title-${Math.random().toString(36).slice(2, 8)}`;

function handleClose() {
  if (isOpen.value) {
    isOpen.value = false;
  }
}

function emitClose() {
  emit("close");
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal-fade" appear @after-leave="emitClose">
        <div
          class="projectModal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="modalTitleId"
          @click.self="handleClose"
          v-show="isOpen"
        >
          <div class="projectModalContent">
            <button
              class="modalClose"
              type="button"
              aria-label="Fermer la modale"
              @click="handleClose"
            ></button>

            <h3 :id="modalTitleId" class="h2">
              {{ props.title }}
            </h3>

            <div class="modalBody">
              <slot />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped lang="scss">
.projectModal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.projectModalContent {
  position: relative;
  width: min(900px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #0b0b0b;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modalClose {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modalClose::before,
.modalClose::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
}

.modalClose::before {
  transform: rotate(45deg);
}

.modalClose::after {
  transform: rotate(-45deg);
}

.modalBody {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 180ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .projectModalContent,
.modal-fade-leave-active .projectModalContent {
  transition:
    transform 220ms ease,
    opacity 220ms ease;
}

.modal-fade-enter-from .projectModalContent,
.modal-fade-leave-to .projectModalContent {
  transform: translateY(8px) scale(0.98);
  opacity: 0.8;
}
</style>
