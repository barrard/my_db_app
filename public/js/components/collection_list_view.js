

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
          <i class="icon-plus"></i> New Collection
        </button>
      </div>
      <div class='row justify-content-center'>
      <h3>Your Collections <i class="icon-folder-open-alt"></i></h3> <br><hr>
        <strong>Total = {{collections.length}}</strong>
      </div>
        <div class='row justify-content-center'>
          <ul v-if="collections.length" class="list-group">
            <li  
              v-for="(collection, index) in collections" 
              @click.prevent="collection_selected(collection)" 
              class="list-group-item text-align-center clickable">
                {{index+1}} - {{collection.collection_name}}
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
