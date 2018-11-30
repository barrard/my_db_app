Vue.component('dynamic-input', {
  data: function () {
    return {

    }
  },
  props: {
    type: String, prop:String

  },
  mounted: function () {

  },

  template: /*html*/`
    <div>
      ${/* Input for Text */''}
      <input v-if="type=='Text'" :id="'_input_'+prop" :name="prop" type="text" @input="input($event.target, prop) " class="form-control">
 
      ${/* Input for Date Time */''}
      <div v-if="type=='Date'" class="row justify-content-center">
        <div class='col-sm-9'>
          <input type="datetime-local" :id="'_input_'+prop" :name="prop" @change="input($event.target, prop)" @input="input($event.target, prop)" class="form-control">
        </div>
        <div class='col-sm-3'>
          <div  class="form-group">
            <input type="checkbox" @input="date_check($event.target.checked, prop) " class="form-control">  
            <small class="form-text text-muted">use current date.</small>      
          </div>
        </div>
      </div>

      ${/* Input for Number */''}
      <input v-if="type=='Number'" :id="'_input_'+prop" :name="prop" type="number" @input="input($event.target, prop) " class="form-control">

      ${/* Input for Check box */''}
      <input v-if="type=='True/False'" :id="'_input_'+prop" :name="prop" checked :value="prop" type="checkbox" @input="input($event.target, prop) " class="form-control">

      ${/* Input for Textarea */''}
      <textarea v-if="type=='Long Text'" :id="'_input_'+prop" :name="prop" @input="input($event.target, prop) " class="form-control"></textarea>
    </div>
  `,
  computed: {

  },
  methods: {
    date_check(val, prop){
      console.log(`set this prop ${prop} ${val} to this date ${new Date().toJSON().slice(0, 19)}`)
      $(`#_input_${prop}`).val(new Date().toJSON().slice(0, 19))
      document.getElementById(`_input_${prop}`).dispatchEvent(new Event("input"))

    },

    input(target, prop) {
      let val = target.value
      console.log({val, prop})
      if($(target).hasClass('is_invalid'))$(target).removeClass('is_invalid')
      // this.$emit('delete_collection', collection_id)
    },
  }
})
