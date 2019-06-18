
Vue.component('create-read-update-delete', {
  data: function () {
    return {
    }
  },
  props: {
  },
  mounted: function () {

  },

  template: /*html*/`
    <form v-if="create_data_form" name="crud">
      ${/* index is the array number, key is the prop name, data type obj */''}
      <div v-for="(key, index) in selected_collection.model" class="relative">
        <div v-for="(val, prop) in key" class="form-group ">
          <dynamic-input 
            :key="index"
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
          <i class="icon-ok"></i>
      </button>
      <button
        @click="add_photo"
        type="button" 
        class="btn btn-info">
          PHOTO 
          <i class="icon-picture"></i>

      </button>
      
      <img-uploader class="off-screen" />
      <div v-if="img_processing_in_progress" class="progress">
        <div class="progress-bar" role="progressbar" :style="'width: '+img_processing_progress+'%;'" :aria-valuenow="img_processing_progress" aria-valuemin="0" aria-valuemax="100">{{img_processing_progress}}%</div>
      </div>
      <div v-if="uploaded_file_names.length">
        <div v-for="(uploaded_file_name, index) in uploaded_file_names" class="card relative inline-flex">
          <img 
            :src="'/user_files/'+uploaded_file_name"
            class="sq-md" 
            alt="Img preview" 
            
          >
          <button 
            @click="remove_img(uploaded_file_name)" 
            type="button" class="btn btn-outline-danger absolute top right">
            <i class="ml-2 icon-ban-circle"></i>
          </button>

        </div>
      </div>

    </form>
  `,
  computed: {
    img_processing_in_progress(){
      return store.state.img_processing_in_progress
    },
    uploaded_file_names(){
      console.log('get uploaded_file_names')
      return store.state.uploaded_file_names
    },
    create_data_form(){
      return store.state.create_data_form
    },
    selected_collection(){
      console.log('get selected_collection')
      return store.state.selected_collection
    },
  },

  methods: {
    remove_img(uploaded_file_name){
      store.commit('remove_img', uploaded_file_name)
    },
    add_photo(){
      console.log('ADD PHOTO')
      $('#file_input').click()
    },  

    async submit_verified_data(data) {
      try {
        console.log(data)
        var data = JSON.stringify(data)
        let collection_id = this.selected_collection._id
        let collection_name = this.selected_collection.collection_name
        let uploaded_file_names = JSON.stringify(this.uploaded_file_names)
        console.log({ data, collection_id, collection_name })
        let collection_data = {
          data, collection_id, collection_name, uploaded_file_names
        }
        let resp = await $.ajax({
          url:'/user/submit_data_to_collection',
          type:'POST',
          beforeSend: function (request) {
            request.setRequestHeader('csrf-token', _csrf);
          },
          // data:JSON.stringify(collection_data)
          data:(collection_data)
        },)
        console.log(resp)
        if(resp.err)throw resp.err
        toast({msg:'Data submited succesfully', type:'success'})
        store.commit('add_new_collection_data', resp.new_user_collection_data);
        // RESET FORM???
        setTimeout(() => {
          store.commit('reset_collection_model_data');
          
        }, 200);
        // $tore.collection_documents.push(resp.new_user_collection_data)
        // $tore.model_input_values[$tore.selected_collection.collection_name] = {}
        // $tore.model_img[$tore.selected_collection.collection_name] = {}
      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:err, type:'success'})
        toast({msg:`DEBUG: - ${data}`, type:'info'})
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
            $(input).removeClass('is_valid')

            err_msg += `${input.name} Needs a Value, <br>`
          }else{
            $(input).addClass('is_valid')
            $(input).removeClass('is_invalid')
  
            data[input.name] = input.value
          }


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

