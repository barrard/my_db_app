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
      <input :type="get_type(this.type)" @input="$event.target.value, this.prop " class="form-control">
    </div>
  `,
  computed: {

  },
  methods: {
    get_type(type){
      console.log(type)
      if(type == "String"){
        return 'text'
      } else if (type == "Date"){
        return 'date'
      }
    },
    input(val, prop) {
      console.log({val, prop})
      // this.$emit('delete_collection', collection_id)
    },
  }
})
