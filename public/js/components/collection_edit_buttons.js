Vue.component('collection-edit-buttons', {
  data: function () {
    return {
      edit_mode: false,
      create_data_form: true
    }
  },
  props: {
    
  },
  computed:{
    selected_collection(){  
      return store.state.selected_collection.collection_name
    },
    collection_id(){
      return store.state.selected_collection._id
    },
    edit_mode(){
      return store.state.edit_mode
    },
    create_data_form(){
      return store.state.create_data_form
    }
  },
  mounted: function () {
    console.log(this.collection_id)
    console.log(this.edit_mode)

  },

  template: /*html*/`
        <div class='collection-edit-buttons'>
          <button 
            @click.prevent="delete_collection(collection_id)" 
            type="button" 
            title="Move Collection to Trash"
            class="btn btn-danger">
            <i class="icon-trash"></i>
          </button>
          <button 
            @click="toggle_edit_mode" 
            type="button" 
            :class="edit_mode ? 'btn-success' : 'btn-outline-info' " 
            :title="edit_mode ? 'Edit mode enabled' : 'Edit mode diabled' "
            class="btn">
            <i class="icon-cogs"></i>

          </button>
          <button 
            @click="toggle_create_data_form" 
            type="button" 
            :class="create_data_form ? 'btn-success' : 'btn-outline-info' " 
            :title="create_data_form ? 'Create mode enabled' : 'Create mode diabled' "
            class="btn">
            <i class="icon-code"></i>
          </button>

          </div>
  `,

  methods: {
    toggle_create_data_form(){
      // this.create_data_form = !this.create_data_form
      // $(`#create_data_form`).toggleClass('minimize')
      // $(`#model_editing_form`).toggleClass('minimize')
      console.log(`minimize create_data_form`)
      store.commit('toggle_create_data_mode')

    },
    toggle_edit_mode() {
      // this.edit_mode = !this.edit_mode
      // this.edit_mode ?
      //   $(`#model_editing_form`).addClass('minimize'):  
      //   $(`#model_editing_form`).removeClass('minimize')
        
      console.log(`minimize model_editing_form`)
      store.commit('toggle_edit_mode')
      // this.$emit('edit_mode', this.edit_mode)
       
    },
    delete_collection(collection_id) {
      console.log(this.collection_id)
      let confirm = window.confirm('Are you sure you sure you want to delete this collections?')
      if (confirm) this.$emit('delete_collection', collection_id)
    },
  }
})
