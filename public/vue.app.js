
console.log('app.js')
const vue_app = new Vue({
  el: '#app',
  data: {
    ...store

  },
  computed:{
    collections(){
      return store.state.collections
    },
    selected_collection(){
      return store.state.selected_collection
    }
  },
  methods:{
    async submit_update_email() {
      try {
        let email = user.email
        let resp = await $.post('/user/update_email', {
          _csrf, email
        })
        if(resp.err)throw resp.err
        toast({ msg: 'Successfully updated email', type: 'success' })

      } catch (err) {
        console.log('err')
        console.log(err)
        toast({msg:'Error updating email', type:'error'})
      }

    },
    async submit_update_password() {
      try {
        let update_password = this.update_password
        let confirm_password = this.confirm_password
        if(update_password != confirm_password) throw 'Passwords do not match'
        let resp = await $.post('/user/update_password', {
          _csrf, update_password, confirm_password
        })
        if(resp.err) throw resp.err
        toast({ msg: 'Successfully updated password', type: 'success' })
      } catch (err) {
        console.log('err')
        console.log(err)
        toast({ msg: `Error updating password, ${err}`, type: 'error' })
      
      }
    },
    async add_model_property({ new_model_property, new_model_property_type }) {
      try {
        let collection_id = this.selected_collection._id
        console.log({ new_model_property, new_model_property_type, collection_id })
        let resp = await $.post('/user/update_collection_model', {
          _csrf, new_model_property, new_model_property_type, collection_id
        });
        console.log(resp)
        if(resp.err)throw 'Error trying to update Model'
        this.selected_collection.model = resp.saved_collection_model
      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({ msg: `${err}`, type: 'error' })

      }

    },
    // async set_selected_collection(selected_collection){
    //   try {
    //     console.log('collection selcteed')
    //     this.selected_collection = selected_collection
    //     console.log(this.selected_collection)
    //     let collection_id = this.selected_collection._id
    //     $tore.model_input_values[this.selected_collection.collection_name] = {}
    //     $tore.model_img[this.selected_collection.collection_name] = {}
    //     //get collection_documents
        // let resp = await $.get('/user/get_collection_documents', {
        //   collection_id
        // })
    //     if(resp.err)throw resp.err
    //     $tore.collection_documents = resp.collection_documents

    //   } catch (err) {
    //     console.log('err')
    //     console.log(err)
    //     toast({msg:err, type:'error'})
    //   }
    // },
    async delete_collection(collection_id) {
      try {
        console.log(`delete_collection ${collection_id}`)
        let resp = await $.post('/user/delete_collection', { _csrf, collection_id })
        if(resp.err)throw err;
        console.log(resp)
        if (resp.delete_collection == true){
          toast({ msg: 'Collection Deleted', type: 'success' })
          let index = this.collections.findIndex((col)=>{
            return col._id == collection_id
          })
          //remove the collection from the array
          this.collections.splice(index, 1)
          //if there are no more items then cant set a new collection
          if (!this.collections ) return
          // set a new collection for the view
          store.commit('set_selected_collection',this.collections[index])


        }

      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:'Error deleting Collection', type:'error'})
        
      }
    },

  },
  async mounted(){
    //get user collections
 
  },
  async beforeCreate(){
    // if (user) {
    //   try {
    //     console.log(this.collections)
    //     let resp = await $.get('/user/get_user_collections')
    //     console.log(resp)
    //     if (resp.err) throw resp.err
    //     this.collections = resp.collections

    //   } catch (err) {
    //     console.log('err')
    //     console.log(err)
    //   }

    // }
  }
})
