Vue.component('collection-model-view', {
  data: function () {
    return {

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
            <collection-edit-buttons
              :collection_id="selected_collection._id"
              @delete_collection = "delete_collection"
            />
            <div class="jumbotron jumbotron-fluid">
              <div class="container-fluid">
                <h1 class="display-4">{{selected_collection.collection_name}}</h1>
                <strong>Data Model</strong><br>
                  <code>{</code>
                  <br>
                  ${/* index is the array number, key is the prop name, data type obj */''}
                  <code v-for="(key, index) in selected_collection.model">
                    ${/* index is the array number, key is the prop name, data type obj */''}
                    <code v-for="(val, prop) in key">
                     {{prop}} :  {{val}} <br>
                    </code>
                  </code>                
                  <code>}</code>
         
                <model-editing-and-building 
                  :selected_collection="selected_collection"
                  @add_model_property="add_model_property"
                />
              </div>
            </div>
            <create-read-update-delete 
              :selected_collection="selected_collection"
            />
          </div>${/* v-else selected_collection = true */''}

        </div>

  `,
  computed: {
 
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
