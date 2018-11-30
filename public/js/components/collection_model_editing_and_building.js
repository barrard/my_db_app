let model_building_vue =  Vue.component('model-editing-and-building', {
  data: function () {
    return {
      data_types: [
        'Text', 'Long Text', 'True/False', 'Date', 'Number'
      ],
      new_model_property: '',
      new_model_property_type:''

    }
  },
  props: {
    selected_collection:Object

  },
  mounted: function () {


  },

  template: /*html*/`

  <form id="model_editing_form">
    <div class='row justify-content-center'>
      <div class='col-sm-6'>
        <div class="form-group">
          <label for="new property name">Model Property</label>
          <input type="text" class="form-control" v-model="new_model_property" id="new_property_input" placeholder="Name">
          <small class="form-text text-muted">Name, Type, Quantiy, Location, etc...</small>
        </div>
      </div>
      <div class='col-sm-6'>
        <div class="form-group">
          <label for="property data type">Data Type</label>
          <select id="new_property_data_type_select" v-model="new_model_property_type" class="custom-select">
          <option value="" >Open this select menu</option>
          <option 
            v-for="type in data_types" 
            :value="type">
              {{type}}
            </option>
          </select> 
          <small class="form-text text-muted">use String for any text data.  Number for integer values, Date for managing Dates.  Boolean is for data that is either True or False i.e. Instock, Discontinued</small>
        </div>
      </div>
    </div>
    <button 
      @click="add_model_property" 
      type="button" 
      class="btn btn-primary">Add To Model
    </button>
 
  </form>

  `,
  computed: {

  },
  methods: {
    add_model_property() {
      let new_model_property = this.new_model_property
      let new_model_property_type = this.new_model_property_type
      
      console.log('add_model_property')
      let valid = this.validate_new_model_property({new_model_property,new_model_property_type})
      if(valid === true){
        this.$emit('add_model_property', { new_model_property, new_model_property_type })
        this.new_model_property = ''
        this.new_model_property_type = ''
      }else{
        toast({msg:`Invalid propety data <br> ${valid}`, type:'error'})
      }

    },
    validate_new_model_property({ new_model_property, new_model_property_type}){
      console.log('Validate!')
      console.log({ new_model_property, new_model_property_type})
      var err_msg = ''
      //make sure they sent us a string
      if (!new_model_property) {
        $('#new_property_input').addClass('is_invalid')
        err_msg += 'Property can\'t be blank <br>'
      }
      // check if this property already exists
      let prop_index = this.selected_collection.model.findIndex((data)=>{
        for(let k in data){
          return k.toLowerCase() === new_model_property.toLowerCase()
        }
      })
      //the index should be < 0 meaning we dont have it yet
      if (!(prop_index < 0)){
        console.log('DUPLICATE NAME')
        err_msg += `This property "${new_model_property}" already exists on the model <br>`
      }
      //verify the data type is coming form our list
      let data_type_ok = this.data_types.indexOf(new_model_property_type)
      if(data_type_ok<0){
        $('#new_property_data_type_select').addClass('is_invalid')
        err_msg += `Data type "${new_model_property_type}" is invalid`
      }
      //err_msg then return
      if(err_msg) return err_msg
      //else we return true and continue on with our lives :)
      return true
 
    }

  }
})
