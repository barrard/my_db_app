Vue.component('data-type-select', {
  data: function () {
    return {
      data_types: [
        'Text', 'Long Text', 'True/False', 'Date', 'Number'
      ],
      new_model_property_type:''
    }
  },
  props: {

  },
  mounted: function () {

  },

  template: /*html*/ `
<div class="form-group">
  <label for="property data type">Data Type</label>
  <select id="new_property_data_type_select" v-model="new_model_property_type" @change="new_model_property_type_selected" class="custom-select">
    <option value="">Open this select menu</option>
    <option v-for="type in data_types" :value="type">
      {{type}}
    </option>
  </select>
  <small class="form-text text-muted">use String for any text data. Number for integer values, Date for managing Dates.
    Boolean is for data that is either True or False i.e. Instock, Discontinued</small>
</div>
`,
  computed: {

  },
  methods: {

    new_model_property_type_selected() {
      console.log(`new_model_property_type ${this.new_model_property_type}`)
      this.$emit('select', this.new_model_property_type)

    }
  }
})