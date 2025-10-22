
<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="q-ma-none text-h4">
          <q-icon name="admin_panel_settings" class="text-primary" />
          Admin Dashboard
        </h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm">
          System management and user administration
        </p>
      </div>
      <div class="col-auto">
        <q-chip
          color="negative"
          text-color="white"
          icon="security"
        >
          Administrator
        </q-chip>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">250</div>
            <div class="text-subtitle2 text-grey-7">Total Users</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">45</div>
            <div class="text-subtitle2 text-grey-7">Active Dentists</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">1,230</div>
            <div class="text-subtitle2 text-grey-7">Appointments</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">12</div>
            <div class="text-subtitle2 text-grey-7">Branches</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Admin Controls -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">User Management</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              flat
              color="primary"
              label="Manage Users"
              icon="people"
              to="/users"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="primary"
              label="Manage Dentists"
              icon="person_health"
              to="/dentist"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="primary"
              label="System Settings"
              icon="settings"
              class="full-width"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-info text-white">
            <div class="text-h6">Content Management</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              flat
              color="info"
              label="Specialties"
              icon="category"
              to="/specialties"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="info"
              label="Publications"
              icon="article"
              to="/publications"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="info"
              label="Branch Management"
              icon="apartment"
              to="/branches"
              class="full-width"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
</style>