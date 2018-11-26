
console.log('app.js')
const vue_app = new Vue({
  el: '#app',
  data: {
    user,
    new_collection_name:'',
    collections:[]
  },
  methods:{
    async send_create_collection(){
      try {
        console.log('SENDOT')
        let collection_name = this.new_collection_name
        let resp = await $.post('/api/add_new_collection',{ collection_name, _csrf })
        console.log(resp)
      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
      }
    },
  },
  async mounted(){
    //get user collections
    if(user){
        try {
          console.log(this.collections)
          let resp = await $.get('/api/get_user_collections')
          console.log(resp)
          if(resp.err)throw resp.err
          this.collections = resp.collections

        } catch (err) {
          console.log('err'.bgRed)
          console.log(err)
        }

    }
  }
})
