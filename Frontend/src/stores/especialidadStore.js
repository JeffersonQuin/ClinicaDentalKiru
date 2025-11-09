import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import especialidades from 'src/data/especialidades.json'
import Fuse from 'fuse.js'

export const useSpecialityStore = defineStore('speciality', () => {
  // State
  const specialities = ref([]) // Especialidades
  const filteredSpecialities = ref([]) // Especialidades filtradas
  const currentPage = ref(0)
  const itemsPerPage = 4
  let fuse = null

  // Fuse.js options for search
  const fuseOptions = {
    keys: ['name', 'description'], // Cambiar 'nombre' y 'descripcion' por 'name' y 'description'
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 1
  }

  // Computed
  const totalPages = computed(() => {
    return Math.ceil(filteredSpecialities.value.length / itemsPerPage)
  })

  const currentPageSpecialities = computed(() => {
    const start = currentPage.value * itemsPerPage
    const end = start + itemsPerPage
    return filteredSpecialities.value.slice(start, end)
  })

  const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const pages = []

    if (total <= 7) {
      for (let i = 0; i < total; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 3) {
        for (let i = 0; i < 5; i++) pages.push(i)
        pages.push('...')
        pages.push(total - 1)
      } else if (current >= total - 4) {
        pages.push(0)
        pages.push('...')
        for (let i = total - 5; i < total; i++) pages.push(i)
      } else {
        pages.push(0)
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(total - 1)
      }
    }

    return pages
  })

  // Actions
  const loadSpecialities = () => {
    specialities.value = especialidades.especialidades || []
    filteredSpecialities.value = specialities.value.filter(s => s.state !== 'eliminado')
    fuse = new Fuse(filteredSpecialities.value, fuseOptions)
  }

  const filterSpecialities = (searchTerm) => {
    currentPage.value = 0
    if (!searchTerm || searchTerm.trim() === '') {
      filteredSpecialities.value = specialities.value.filter(s => s.state !== 'eliminado')
    } else {
      const results = fuse.search(searchTerm.trim())
      filteredSpecialities.value = results.map(result => result.item)
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--
    }
  }

  const goToPage = (page) => {
    if (page !== '...' && page >= 0 && page < totalPages.value) {
      currentPage.value = page
    }
  }

  const createSpeciality = (newSpeciality) => {
    const maxId = specialities.value.length > 0 
      ? Math.max(...specialities.value.map(s => s.id)) 
      : 0
    newSpeciality.id = maxId + 1
    newSpeciality.state = 'active'
    specialities.value.push(newSpeciality)
    filterSpecialities('')
  }

  const updateSpeciality = (updatedSpeciality) => {
    const index = specialities.value.findIndex(s => s.id === updatedSpeciality.id)
    if (index > -1) {
      specialities.value[index] = { ...updatedSpeciality }
      filterSpecialities('')
    }
  }

  const deleteSpeciality = (specialityId) => {
    const index = specialities.value.findIndex(s => s.id === specialityId)
    if (index > -1) {
      specialities.value[index].state = 'eliminado'
      filterSpecialities('')
    }
  }

  // Return everything that should be available externally
  return {
    // State
    specialities,
    filteredSpecialities,
    currentPage,

    // Computed
    totalPages,
    currentPageSpecialities,
    visiblePages,

    // Actions
    loadSpecialities,
    filterSpecialities,
    nextPage,
    previousPage,
    goToPage,
    createSpeciality,
    updateSpeciality,
    deleteSpeciality
  }
})
