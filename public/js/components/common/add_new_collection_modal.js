


Vue.component('add-new-collection-modal', {
  data: function () {
    return {
      new_collection_name: '',
      add_starter_model: 'yes',
    }
  },
  props: {
  },
  mounted() {

  },

  template: /*html*/`
  <div class="modal fade new-collection-modal-lg" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h6 style="color: #000">Choose a descriptive name for your collection i.e. "items"</h6>
        <form>
          <div class="form-group">
            <label for="exampleInputEmail1">Collection Name</label>
            <input 
              id="new_collection_name_input"
              v-model="new_collection_name" 
              type="text" class="form-control" 
              aria-describedby="collection name"
              placeholder="Collection Name">
            <small class="form-text text-muted">Ex. Employees, Customers, Inventory</small>
          </div>
          <input type="hidden" name="_csrf" value="<%= csrf_token_function()%>">
          <div class='row justify-content-center'>
            <div class='col-sm-6'>
              <div class="form-group">
                <label for="add_starter_model">Include default Model</label>
                <input type="checkbox" checked v-model="add_starter_model" true-value="yes" false-value="no">
                <small class="form-text text-muted">Name, Description</small>
              </div>
            </div>
            <div class='col-sm-6'>
              <button @click.prevent="send_create_collection" class="btn btn-primary">Create</button>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  `,
  computed: {
    collection_name(){
      return store.state.selected_collection.collection_name
    },
    selected_collection(){
      return store.state.selected_collection
    },
    edit_mode(){
      return store.state.edit_mode && store.state.create_data_form
    }

  },

  methods: {
    async send_create_collection(){
      try {
        let collection_name = this.new_collection_name
        let add_starter_model = this.add_starter_model
        let resp = await $.post('/user/add_new_collection',{ 
          add_starter_model, collection_name, _csrf })
        console.log(resp)
        this.new_collection_name = ''
        if(resp.err)throw resp.err
        if(resp.new_collection){
          store.commit('add_new_collection', resp.new_collection)
          let name = resp.new_collection.collection_name
          toast({ msg: `Collection <strong>${name}</strong> added`, type: 'success' })
          $('.new-collection-modal-lg').modal('hide')
          store.commit('set_selected_collection', resp.new_collection)
  
        }
  
      } catch (err) {
        console.log('err')
        console.log(err)
        $('#new_collection_name_input').addClass('is_invalid')
        toast({msg:err, type:'error'})
      }
    },

    async submit_verified_data(data) {
      try {
        console.log(data)
        let collection_id = this.selected_collection._id
        let collection_name = this.selected_collection.collection_name
        console.log({ data, _csrf, collection_id, collection_name })
        let resp = await $.post('/user/submit_data_to_collection', {
          ...data, _csrf, collection_id, collection_name
        })
        console.log(resp)
        if(resp.err)throw resp.err
        toast({msg:'Data submited succesfully', type:'success'})
        store.commit('add_new_collection_data', resp.new_user_collection_data)
        store.commit('reset_collection_model_data', this.collection_name)

      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:err, type:'error'})
      }
    },
    verify_data() {
      //Get all values from the form
      const inputs = document.querySelectorAll('[id^=_input]')
      console.log(inputs)
      let err_msg = ''
      let data = {}
      inputs.forEach(input => {
        if (input.type == 'checkbox') {
          console.log(input.name)
          console.log(input.checked)
          $(input).addClass('is_valid')
          data[input.name] = input.checked

        } else {
          console.log(input.name)
          console.log(input.value)
          if (!input.value) {
            $(input).addClass('is_invalid')
            err_msg += `${input.name} Needs a Value, <br>`
          }
          $(input).addClass('is_valid')
          data[input.name] = input.value

        }

      });
      // if(!Object.keys(data).length)err_msg += 'Data is empty! <br>'
      if (err_msg) {
        return toast({ msg: err_msg, type: 'error' })
      }
      this.submit_verified_data(data)

    },
    delete_collection(collection_id) {
      this.$emit('delete_collection', collection_id)
    },
  }
})

