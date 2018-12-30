Vue.component('edit-data-input', {
  data: function () {
    return {

      data_types: [
        'Text', 'Long Text', 'True/False', 'Date', 'Number'
      ],

    }
  },
  props: {
    prop_name: String, prop_type: String, index:String, 

  },
  mounted(){
    console.log(`Mounted with prop_name ${this.prop_name} and prop_type ${this.prop_type}
      and value ${this.data_input_values} index ${this.index}
    `)
  },  

  computed: {
    collection_documents(){
      console.log('What is selected colllection '+store.state.collection_documents)
      return store.state.collection_documents;
    },

    data_input_values:{
      set(value){
        let prop_name = this.prop_name
        let index = this.index
        console.log('Setting model input value '+value+' '+prop_name)
        store.commit('update_collection_data', {prop_name, value, index})
      },
      get(){
        let prop_name = this.prop_name
        let index = this.index
        console.log(store.state.collection_documents[index].data[prop_name])
        return store.state.collection_documents[index].data[prop_name]
      }
    }

  },

  template: /*html*/`
    <td >

      ${/* Template for starndard mode, i.e. non-edit mode */''}
        ${/* Input for Text */''}
        <input v-if="prop_type=='Text'" 
          :id="'_edit_data_input_'+prop_name" 
          :name="prop_name" 
          type="text" 
          v-model="data_input_values"
          class="form-control"
         >
  
        ${/* Input for Date Time */''}
        <div v-if="prop_type=='Date'">
          <div  class="row justify-content-center">
            <div class='col-sm-12'>
              <input type="datetime-local" 
                v-model="data_input_values"
                :id="'_edit_data_input_'+prop_name" 
                :name="prop_name" 
                class="form-control">
            </div>
    
              <div  class="flex align-center">
                <input type="checkbox" 
                  @input="date_check($event.target.checked, prop_name) " 
                  class="">
                <small class="form-text text-muted">use current date.</small> 
              </div>
          </div>
        </div>

        ${/* Input for Number */''}
        <input v-if="prop_type == 'Number'"
          :id="'_edit_data_input_'+prop_name"  
          :value.number="value" 
          :name="prop_name" 
          type="number" 
          
          class="form-control">


        ${/* Input for Check box */''}
        <input v-if="prop_type=='True/False'" 
          :id="'_edit_data_input_'+prop_name"  
          v-model="data_input_values" 
          :name="prop_name" 
          checked 
          :value="prop_name" type="checkbox" 
          
          class="form-control">

        ${/* Input for Textarea */''}
        <textarea 
          v-if="prop_type=='Long Text'" 
          :id="'_edit_data_input_'+prop_name" 
          v-model="data_input_values" 
          :name="prop_name" 
          
          class="form-control">
        </textarea>


    </td>
  `,

  methods: {

    

    date_check(val, prop_name) {
      console.log(`set this prop ${prop_name} ${val} to this date ${new Date().toJSON().slice(0, 19)}`)
      $(`#_edit_data_input_${prop_name}`).val(new Date().toJSON().slice(0, 19))
      document.getElementById(`_edit_data_input_${prop_name}`).dispatchEvent(new Event("input"))

    },
  }
})
