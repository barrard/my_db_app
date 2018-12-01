
Vue.component('create-read-update-delete', {
  data: function () {
    return {
    }
  },
  props: {
    selected_collection: Object, edit_mode:Boolean
  },
  mounted: function () {

  },

  template: /*html*/`
    <form>
      ${/* index is the array number, key is the prop name, data type obj */''}
      <div v-for="(key, index) in selected_collection.model" class="relative">
        <div v-for="(val, prop) in key" class="form-group ">
          <dynamic-input 
            :edit_mode="edit_mode" 
            :type="val" 
            :prop="prop"
            class="col-sm-12">
        </div>
        <hr>
      </div> 
       <button
        @click="verify_data"
        type="button" 
        class="btn btn-success">
          SUBMIT DATA
      </button>
    </form>
  `,
  computed: {

  },

  methods: {

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
        $tore.collection_documents.push(resp.new_user_collection_data)
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

