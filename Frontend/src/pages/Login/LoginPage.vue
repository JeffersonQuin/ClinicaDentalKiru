<template>
  <q-page class="flex flex-center" style="min-height:100vh;">
    <q-card class="row no-wrap" style="max-width:900px; width:100%;">
      
      <div class="col-12 col-md-6 q-pa-lg">
        <div class="row items-center q-gutter-sm">
          <q-img :src="logo" fit="contain"  style="width: 120px; height: 120px; display: block; margin: 0 auto;"  />
        </div>

        <div class="q-mt-lg">
          <q-form class="column q-gutter-md">
            <q-input v-model="email" label="Email" dense outlined autofocus />
            <q-input v-model="password" label="Contraseña" dense outlined type="password" />


            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn flat label="CANCELAR" color="grey-7" />
              <q-btn unelevated label="INGRESAR" color="primary" />
            </div>
          </q-form>
        </div>

        <div class="q-mt-lg text-center">
          <small class="text-grey">© 2025 KIRU Odontología</small>
        </div>
      </div>

     
      <div class="col-12 col-md-6 flex flex-center" style="min-height:100%; background: linear-gradient(135deg,#6b46ff 0%, #4f46e5 100%); border-radius: 0 8px 8px 0;">
        <div class="q-pa-lg text-center" style="color: white; max-width:260px;">
          <div class="text-h5" style="font-weight:600;">¡Bienvenido de vuelta!</div>
          <div class="text-subtitle2 q-mt-md" style="opacity:0.95;">
            Accede rápido a tu panel para administrar citas y reservas.
          </div>
          <div class="q-mt-lg">
            <q-btn flat round dense icon="fa-solid fa-info" color="white" class="q-mr-sm" />
            <q-btn flat round dense icon="fa-solid fa-phone" color="white" />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>


export default {
  name: 'LoginPage',
  data () {
    return {
      logo: '/KiruIMG/LogoKiru.png',
      email: '',
      password: '',
      rememberMe: false
    }
  }
}
</script>

<style scoped>
@media (max-width: 959px) {
  
  .q-card > div:nth-child(2) {
    border-radius: 0 0 8px 8px !important;
  }
}
</style>