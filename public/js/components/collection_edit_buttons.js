Vue.component('collection-edit-buttons', {
  data: function () {
    return {
      edit_form:true
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
            class="btn btn-danger">
            X
          </button>
          <button 
            @click="toggle_edit_form" 
            type="button" 
            :class="edit_form ? 'btn-info' : 'btn-outline-info' " 
            class="btn">
              EDIT
            </button>
  


          </div>
  `,
  computed: {
    
  },
  methods: {
    toggle_edit_form() {
      this.edit_form = !this.edit_form
      $(`#model_editing_form`).toggleClass('minimize')
      console.log(`minimize model_editing_form`)
       
    },
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
    },
  }
})
