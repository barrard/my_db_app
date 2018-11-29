Vue.component('collection-edit-buttons', {
  data: function () {
    return {

    }
  },
  props: {
    collection_id:String
    
  },
  mounted: function () {

  },

  template: /*html*/`
        <div class='collection-edit-buttons'>
          <button @click.prevent="delete_collection(collection_id)" type="button" class="btn btn-danger">X</button>
        </div>
  `,
  computed: {
    
  },
  methods: {
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
    },
  }
})
