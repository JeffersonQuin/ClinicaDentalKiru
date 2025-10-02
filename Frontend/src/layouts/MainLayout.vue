<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Usar el HeaderLayout personalizado -->
    <HeaderLayout />
    
    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <!-- Footer opcional -->
    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          © 2025 KIRU Odontología - Todos los derechos reservados
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    
    <!-- Botón flotante para agendar citas -->
    <FloatingButton />
  </q-layout>
</template>

<script setup>
import HeaderLayout from './HeaderLayout.vue'
import FloatingButton from '../components/FloatingButton.vue'
</script>
