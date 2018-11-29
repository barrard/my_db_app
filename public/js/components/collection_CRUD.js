
Vue.component('create-read-update-delete', {
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
    <form>
      ${/* index is the array number, key is the prop name, data type obj */''}
      <div v-for="(key, index) in selected_collection.model">
        <div v-for="(val, prop) in key" class="form-group row justify-content-center">
     
          <label for="staticEmail" class="col-sm-2 col-form-label">{{prop}}</label>
            <dynamic-input :type="val" class="col-sm-6">
        </div>
      </div>  
    </form>
  `,
  computed: {
    props_array() {
      let model_array = this.selected_collection.model
      console.log(model_array)
      console.log(model_array)
      console.log(model_array)
      console.log(model_array)
    }
  },

  methods: {
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
    },
  }
})

