

const list_vue = Vue.component('collection-list-view', {
  data: function () {
    return {

    }
  },
  props: {
    collections: Array
  },
  mounted: function () {

  },

  template: /*html*/`
    <div>
      <div class='row justify-content-center'>
        <button 
          data-toggle="modal" 
          data-target=".new-collection-modal-lg" 
          type="button" class="btn btn-primary">
            + New Collection
        </button>
      </div>
      <div class='row justify-content-center'>
        <strong>Collections - {{collections.length}}</strong>
      </div>
        <div class='row justify-content-center'>
          <ul v-if="collections.length" class="list-group">
            <li  
              v-for="collection in collections" 
              @click.prevent="collection_selected(collection)" 
              class="list-group-item text-align-center clickable">
                {{collection.collection_name}}
            </li>
          </ul>
          <div v-if="!collections.length">
            <p>You don't have any collections yet</p>
          </div>
      </div>
    </div>
  `,
  methods: {
    collection_selected(collection) {
      this.$emit('collection_selected', collection)
      console.log(collection)


    },

  }
})
