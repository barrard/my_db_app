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
              class="btn btn-primary btn-sm">
                X
              </button>
            <button 
              type="button" 
              @click="edit_prop_mode"
              class="btn btn-secondary btn-sm">
                EDIT
              </button>
          </div>


  `,
  computed: {

  },
  methods: {
    async delete_prop() {
      let prop = this.prop
      let collection_id = $tore.selected_collection._id
      console.log(`Delete ${prop}`)
      let confirm = window.confirm(`Are you sure you sure you want to delete ${this.prop}?`)
      // if (confirm) this.$emit('delete_prop', collection_id)
      if (confirm) {
        try {
          console.log('$tore.selected_collection.model')
          let resp = await $.post('/user/delete_model_prop', {
            _csrf, prop, collection_id
          })
          if (resp.err || !resp.model) throw `Error deleting ${prop} from model`
          toast({ msg: `Deleted ${prop} from the data model`, type:'success' })
          $tore.selected_collection.model = resp.model
        } catch (err) {
          logger.log('err'.bgRed)
          logger.log(err)
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
