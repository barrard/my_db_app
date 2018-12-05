Vue.component('collection-model-view', {
  data: function () {
    return {

    }
  },
  props: {
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
                  @delete_collection = "delete_collection"
                />    
              </header>

              <div class="container-fluid">
                <h1 class="display-4">{{selected_collection.collection_name}}</h1>
                <create-read-update-delete 
     
                />
                <hr>
         
                <model-editing-and-building 
                  @add_model_property="add_model_property"

                />
              </div>
            </div>

          </div>${/* v-else selected_collection = true */''}
          <add-new-collection-modal />
        </div>

  `,
  computed: {
    selected_collection(){
      return store.state.selected_collection
    }
 
  },
  methods: {

    add_model_property({ new_model_property, new_model_property_type }) {
      this.$emit('add_model_property', { new_model_property, new_model_property_type })
    },
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
      console.log('delete_collection')
    },

  }
})
