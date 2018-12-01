Vue.component('collection-edit-buttons', {
  data: function () {
    return {
      edit_form: true,
      create_data_form: true
    }
  },
  props: {
    collection_id:String
    
  },
  mounted: function () {

  },

  template: /*html*/`
        <div class='collection-edit-buttons'>
          <button 
            @click.prevent="delete_collection(collection_id)" 
            type="button" 
            title="Move Collection to Trash"
            class="btn btn-warning">
            X
          </button>
          <button 
            @click="toggle_edit_form" 
            type="button" 
            :class="edit_form ? 'btn-success' : 'btn-danger' " 
            :title="edit_form ? 'Edit mode enabled' : 'Edit mode diabled' "
            class="btn">
              EDIT
          </button>
          <button 
            @click="toggle_create_data_form" 
            type="button" 
            :class="create_data_form ? 'btn-success' : 'btn-danger' " 
            :title="create_data_form ? 'Create mode enabled' : 'Create mode diabled' "
            class="btn">
              CREATE
          </button>
  


          </div>
  `,
  computed: {
    
  },
  methods: {
    toggle_create_data_form(){
      this.create_data_form = !this.create_data_form
      $(`#create_data_form`).toggleClass('minimize')
      console.log(`minimize create_data_form`)
    },
    toggle_edit_form() {
      this.edit_form = !this.edit_form
      $(`#model_editing_form`).toggleClass('minimize')
      console.log(`minimize model_editing_form`)
      this.$emit('edit_mode', this.edit_form)
       
    },
    delete_collection(collection_id) {
      let confirm = window.confirm('Are you sure you sure you want to delete this collections?')
      if (confirm) this.$emit('delete_collection', collection_id)
    },
  }
})
