import { ref, reactive } from 'vue'

export function useCrud(config) {
  const loading = ref(false)
  const items = ref([])
  const currentItem = reactive({})
  const showForm = ref(false)
  const showConfirm = ref(false)
  const isEditing = ref(false)

  const fetchItems = async () => {
    loading.value = true
    try {
      // Aquí llamarías a tu API
      const response = await config.api.getAll()
      items.value = response.data
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      loading.value = false
    }
  }

  const createItem = async (data) => {
    loading.value = true
    try {
      await config.api.create(data)
      await fetchItems()
      showForm.value = false
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, data) => {
    loading.value = true
    try {
      await config.api.update(id, data)
      await fetchItems()
      showForm.value = false
    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id) => {
    loading.value = true
    try {
      await config.api.delete(id)
      await fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      loading.value = false
    }
  }

  const openForm = (item = null) => {
    if (item) {
      Object.assign(currentItem, item)
      isEditing.value = true
    } else {
      Object.keys(currentItem).forEach(key => {
        currentItem[key] = ''
      })
      isEditing.value = false
    }
    showForm.value = true
  }

  const openConfirmDelete = (item) => {
    Object.assign(currentItem, item)
    showConfirm.value = true
  }

  const handleSubmit = (data) => {
    if (isEditing.value) {
      updateItem(currentItem.id, data)
    } else {
      createItem(data)
    }
  }

  return {
    loading,
    items,
    currentItem,
    showForm,
    showConfirm,
    isEditing,
    fetchItems,
    openForm,
    openConfirmDelete,
    handleSubmit,
    deleteItem
  }
}