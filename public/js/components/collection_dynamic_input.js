Vue.component('dynamic-input', {
  data: function () {
    return {
      edit_prop_mode: false,
      new_prop_name: '',
      new_prop_type: '',
      old_prop_name:'',
      old_prop_type:'',
      data_types: [
        'Text', 'Long Text', 'True/False', 'Date', 'Number'
      ],

    }
  },
  props: {
    type: String, prop: String, key:Number

  },
  beforeMount(){
    console.log('mounting dynatic input')
    console.log(store.state.model_input_values[this.selected_collection.collection_name])
    if(store.state.model_input_values[this.selected_collection.collection_name]== null){
      // store.commit('set_collection_model_input_obj', this.selected_collection.collection_name)
    }
    console.log(store.state.model_input_values[this.selected_collection.collection_name]== null)

},
  computed: {
    edit_mode(){
      return store.state.edit_mode
    },
    selected_collection(){
      console.log('What is selected colllection '+store.state.selected_collection.collection_name)
      return store.state.selected_collection;
    },

    get_value(){
      let collection = this.selected_collection.collection_name
      console.log('GET model_input_values for '+collection)
      console.log(store.state.model_input_values[collection][this.prop])
      return store.state.model_input_values[collection][this.prop]
    },

    model_input_values:{
      set(value){
        let prop = this.prop
        console.log('Setting model input value '+value+' '+this.prop)
        store.commit('set_collection_model_data', {prop, value})
      },
      get(){
        let collection = this.selected_collection.collection_name
        console.log('GET model_input_values for '+collection)
        console.log(store.state.model_input_values[collection][this.prop])
        return store.state.model_input_values[collection][this.prop]
      }
    }


  },

  template: /*html*/`
    <div class="row" :key="key">
      <prop-edit-btns 
        @set_edit_prop_mode="set_edit_prop_mode" 
        v-if="edit_mode"  
        :type="type" 
        :prop="prop" 
        class='col-sm-3 prop-edit-btns'
      />
      ${/* Template for starndard mode, i.e. non-edit mode */''}
      <template v-if="!edit_prop_mode">
        <label :for="prop" class="col-sm-3 col-form-label">{{prop}}</label>

        ${/* Input for Text */''}
        <input v-if="type=='Text'" 
          :id="'_input_'+prop" 
          :name="prop" 
          type="text" 
          v-model="model_input_values"
          class="form-control"
          :class='[edit_mode ? "col-sm-6" : "col-sm-9"]'>
  
        ${/* Input for Date Time */''}
        <div v-if="type=='Date'" :class='[edit_mode ? "col-sm-6" : "col-sm-9"]'>
          <div  class="row justify-content-center">
            <div class='col-sm-12'>
              <input type="datetime-local" 
                v-model="model_input_values"
                :id="'_input_'+prop" 
                :name="prop" 
                @change="input($event.target, prop)" 
                class="form-control">
            </div>
    
              <div  class="flex align-center">
                <input type="checkbox" @input="date_check($event.target.checked, prop) " class="">
                <small class="form-text text-muted">use current date.</small> 
              </div>
          </div>
        </div>

        ${/* Input for Number */''}
        <input v-if="type=='Number'" :id="'_input_'+prop"  v-model.number="model_input_values" :name="prop" type="number" :class='[edit_mode ? "col-sm-6" : "col-sm-9"]' class="form-control">


        ${/* Input for Check box */''}
        <input v-if="type=='True/False'" :id="'_input_'+prop"  v-model="model_input_values" :name="prop" checked :value="prop" type="checkbox" :class='[edit_mode ? "col-sm-6" : "col-sm-9"]' class="form-control">

        ${/* Input for Textarea */''}
        <textarea v-if="type=='Long Text'" :id="'_input_'+prop" v-model="model_input_values" :name="prop" :class='[edit_mode ? "col-sm-6" : "col-sm-9"]' class="form-control"></textarea>

        ${/* For some reason, this needs to go last */''}
        ${/* Input for File/Image */''}

      </template>

      ${/* Template for edit mode */''}
      <template v-else>
        <div class='col-sm-9'>
          <div class='row justify-content-center'>
          <input type="text" :value="prop" v-model="new_prop_name" class="col-sm-4">

          <select id="new_property_data_type_select" v-model="new_prop_type" class="col-sm-8 custom-select">
          <option 
            v-for="type in data_types" 
            :value="type">
              {{type}}
            </option>
          </select> 
          </div>
          <div class='row justify-content-center'>
            <button 
              type="button" 
              @click="save_new_prop"
              class="btn btn-sm btn-primary">
              SAVE <i class="ml-2 icon-save"></i>
            </button>
            <button 
              type="button" 
              @click="cancel_prop_edit_mode"
              class="btn btn-sm btn-secondary">
              CANCEL<i class="ml-2 icon-ban-circle"></i>
            </button>
          </div>
        </div>

      
      </template>

    </div>
  `,

  methods: {

    set_value(value){
      let prop = this.prop
      console.log('Setting model input value '+value+' '+this.prop)
      store.commit('set_collection_model_data', {prop, value})
    },
    async save_new_prop(){
      try {
        let collection_id = store.state.selected_collection._id
        let {old_prop_name,
          old_prop_type,
          new_prop_name,
          new_prop_type} = this
        let resp = await $.post('/user/edit_new_prop', {
          _csrf, 
          collection_id,
          old_prop_name,
          old_prop_type,
          new_prop_name,
          new_prop_type
        })
        if(resp.err)throw 'Error saving edited prop'
        console.log(resp.new_model_obj)
        let new_model_data = resp.new_model_obj
        for(let prop in new_model_data){
          this.prop = prop
          this.type = new_model_data[prop]
        }
        this.edit_prop_mode = false
        store.commit('set_new_model_data', new_model_data)


      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:err, type:'error'})
      }


    },
    cancel_prop_edit_mode(){
      this.edit_prop_mode = false

    },
    set_edit_prop_mode() {
      console.log('edit_prop_modeedit_prop_modeedit_prop_modeedit_prop_modeedit_prop_modeedit_prop_mode')
      this.edit_prop_mode = !this.edit_prop_mode
      this.new_prop_name = this.prop
      this.new_prop_type = this.type
      this.old_prop_name = this.prop
      this.old_prop_type = this.type
      console.log('edit prop mode = '+this.edit_prop_mode)
    },


    date_check(val, prop) {
      console.log(`set this prop ${prop} ${val} to this date ${new Date().toJSON().slice(0, 19)}`)
      $(`#_input_${prop}`).val(new Date().toJSON().slice(0, 19))
      document.getElementById(`_input_${prop}`).dispatchEvent(new Event("input"))

    },

    // input(target, prop) {
    //   let val = target.value
    //   console.log({ val, prop })
    //   model_input_values[prop] = val
    //   if ($(target).hasClass('is_invalid')) $(target).removeClass('is_invalid')
    // },
  }
})
