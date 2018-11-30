
Vue.component('edit-btn', {
  data: function () {
    return {

    }
  },
  props: {
    target: String
  },
  mounted: function () {

  },

  template: /*html*/`
    <button @click="minimize_target" type="button" class="btn btn-primary">EDIT</button>

  `,
  computed: {

  },

  methods: {
    minimize_target() {
      $(`#${this.target}`).addClass('minimize')
      console.log(`minimize ${this.target}`)
    },
  }
})

