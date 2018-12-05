store = new Vuex.Store({
  state: {
    user,
    update_password: '',
    confirm_password: '',
    collections: collections,
    selected_collection: null,
    edit_mode: false,
    create_data_form:true,
    collection_documents:[],
    model_input_values:{},
    model_img:{},
    test:false,
    img_processing_progress: 0,
    img_processing_in_progress: false,
    uploaded_file_names:[],

  },
  mutations: {
    remove_img(state, uploaded_file_name){
      let file_index = state.uploaded_file_names.findIndex((file)=>{
        return uploaded_file_name == file
      })
      state.uploaded_file_names.splice(file_index, 1);
    },
    set_uploaded_file_name(state, file_name){
      console.log('uploaded file')
      state.uploaded_file_names.push(file_name)
    },
    toggle_create_data_mode(state){
      state.create_data_form = !state.create_data_form
    },
    toggle_edit_mode(state){
      state.edit_mode = !state.edit_mode
    },
    reset_collection_model_data(state){
      console.log('reset the data')
      let collection_name = store.state.selected_collection.collection_name
      console.log(collection_name)
      //reset data //TODO allow some values to remain
      state.model_input_values[collection_name] = {}
      //remove the is_valid class for new data
      const inputs = document.querySelectorAll('[id^=_input_]')
      inputs.forEach(input => {
        $(input).removeClass('is_valid')
      });
    },
    add_new_collection_data(state, data){
      state.collection_documents.push(data)
    },
    set_new_model_data(state, model){
      state.selected_collection.model = model
    },
    delete_prop(state, collection_name, prop){
      delete state.model_input_values[collection_name][prop]
    },

    set_collection_model_data(state, {prop, value}){
      console.log({prop, value})
      console.log(prop)
      let collection = state.selected_collection.collection_name;
      // state.model_input_values[collection][prop] = value
      Vue.set(state.model_input_values[collection], [prop], value)
      console.log( `this.set_collection_model_data ${collection} prop ${prop} val ${value}`)

    },
    set_collection_model_input_obj(state, collection_name){
      console.log('set up input obj '+collection_name)
      if(state.model_input_values[collection_name])return
      Vue.set(state.model_input_values, collection_name, {})
      // state.model_input_values[collection]={}
    },
    add_new_collection(state, new_collection){
      state.collections.push(new_collection)

    },
    async set_selected_collection(state, selected_collection){
      state.selected_collection = selected_collection
      this.commit('set_collection_model_input_obj', selected_collection.collection_name)
      console.log('SET SELECTED COLLECTION '+selected_collection)
      try {
        let resp = await $.get('/user/get_collection_documents', {
          collection_id:state.selected_collection._id
        })
        state.collection_documents = resp.collection_documents
      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
      }
    },
    edit_model_prop(state) {
      console.log('state edit model prop')
    },
    // async set_selected_collection(state, selected_collection) {
    //   try {
    //     console.log({state, selected_collection})
    //     console.log('collection selcteed')
    //     console.log('collection selcteed')
    //     console.log('collection selcteed')
    //     console.log('collection selcteed')
    //     console.log('collection selcteed')
    //     console.log('collection selcteed')
    //     state.selected_collection = selected_collection
    //     console.log(state.selected_collection)

    //   } catch (err) {
    //     console.log('err')
    //     console.log(err)
    //     toast({ msg: err, type: 'error' })
    //   }
    // },
  },

})

// $tore={
  // user,
  // update_password: '',
  // confirm_password: '',
  // new_collection_name: '',
  // add_starter_model: 'yes',
  // collections: collections,
  // selected_collection: null,
  // edit_mode: false,
  // collection_documents:[],
  // // preview_img_src:{},//Object to allow multiple img mapped to different property names
  // model_input_values:{},
  // model_img:{},
  // test:false
// }

