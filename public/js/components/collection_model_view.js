Vue.component('collection-model-view', {
  data: function () {
    return {
      edit_mode:true

    }
  },
  props: {
    selected_collection: Object
  },
  mounted: function () {


  },

  template: /*html*/`

        <div class='text-align-center'>
          <div v-if="!selected_collection">
            Please select a collection from the collection list, or create a new one
          </div>
          <div v-else>

            <div class="jumbotron jumbotron-fluid relative">
              <header class="top_right_btns">
                <collection-edit-buttons
                  :collection_id="selected_collection._id"
                  @delete_collection = "delete_collection"
                  @edit_mode = "set_edit_mode"
                />    
              </header>

              <div class="container-fluid">
                <h1 class="display-4">{{selected_collection.collection_name}}</h1>
                <create-read-update-delete id="create_data_form"
                  :selected_collection="selected_collection"
                  :edit_mode="edit_mode"
     
                />
                <hr>
         
                <model-editing-and-building 
                  :selected_collection="selected_collection"
                  @add_model_property="add_model_property"
                />
              </div>
            </div>

          </div>${/* v-else selected_collection = true */''}

        </div>

  `,
  computed: {
 
  },
  methods: {

    set_edit_mode(mode){
      this.edit_mode = mode
    },
    add_model_property({ new_model_property, new_model_property_type }) {
      this.$emit('add_model_property', { new_model_property, new_model_property_type })
    },
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
      console.log('delete_collection')
    },

  }
})
