Vue.component('prop-edit-btns', {
  data: function () {
    return {

    }
  },
  props: {
     type:String, prop:String

  },
  mounted: function () {

  },

  template: /*html*/`

          <div class='col-sm-3'>
            <button 
              @click="delete_prop"
              type="button" 
              class="btn btn-danger btn-sm">
              <i class="icon-trash"></i>
              </button>
            <button 
              type="button" 
              @click="edit_prop_mode"
              class="btn btn-secondary btn-sm">
              <i class="icon-cog"></i>
              </button>
          </div>


  `,
  computed: {
    collection_id(){
      return store.state.selected_collection._id
    },
    collection_name(){
      return store.state.selected_collection.collection_name
    },

  },
  methods: {
    async delete_prop() {
      let prop = this.prop
      console.log(`Delete ${prop}`)
      let confirm = window.confirm(`Are you sure you sure you want to delete ${this.prop}?`)
      if (confirm) {
        try {
          let collection_id= this.collection_id
          console.log('$tore.selected_collection.model')
          let resp = await $.post('/user/delete_model_prop', {
            _csrf, prop, collection_id
          })
          if (resp.err || !resp.model) throw `Error deleting ${prop} from model`
          toast({ msg: `Deleted ${prop} from the data model`, type:'success' })
          //delete the prop from the data
          store.commit('delete_prop', this.collection_name, prop )
          store.commit('set_new_model_data', resp.model )
        } catch (err) {
          console.log('err'.bgRed)
          console.log(err)
          toast({msg:err, type:'error'})
        }

      }


    },
    edit_prop_mode() {
      console.log(`edit ${this.prop}`)
      // this.edit_form = !this.edit_form
      // $(`#model_editing_form`).toggleClass('minimize')
      // console.log(`minimize model_editing_form`)
      this.$emit('set_edit_prop_mode')
    },
  }
})
