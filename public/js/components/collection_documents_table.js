Vue.component('collections-documents-table', {
  data: function () {
    return {
    }
  },
  props: {

  },

  computed:{
    collection_documents(){
      return store.state.collection_documents

    },
    selected_collection(){
      return store.state.selected_collection
    },
    model_keys(){
      let keys = []
      this.selected_collection.model.forEach(prop_obj => {
        for(let key in prop_obj){
          keys.push(key)
        }
      });
      return keys

    }
  },  

  methods: {
    async trash_document(document_id){
      try {
        console.log(`Trash this document ${document_id}`)
      let resp = await $.post('/user/trash_document', {
        _csrf, document_id
      })
      if(resp.err)throw resp.err
      console.log(resp)
      toast({msg:'Trash Document', type:'success'})

      } catch (err) {
        logger.log('err'.bgRed)
        logger.log(err)
        toast({msg:err, type:'error'})

      }

    },
    async edit_document(document_id){
      try {
        console.log(`Edit this document ${document_id}`)
      let resp = await $.post('/user/edit_document', {
        _csrf, document_id
      })
      if(resp.err)throw resp.err
      console.log(resp)
      toast({msg:'Edit Document', type:'success'})

      } catch (err) {
        logger.log('err'.bgRed)
        logger.log(err)
        toast({msg:err, type:'error'})
      }
    },
  },

  template: /*html*/`
    <div v-if="selected_collection" class="container">
      <div class='row'>
        <table class="table">
          <thead>
            <tr>
              <th> </th>
              <th scope="col">#</th>
              <th v-for="key in model_keys" scope="col">{{key}}</th>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr v-for="(document, index) in collection_documents">
            <td> 
              <button @click="trash_document(document._id)" type="button" class="btn btn-sm btn-outline-danger">
                <i class="icon-trash"></i>
              </button>
              <button @click="edit_document(document._id)" type="button" class="btn btn-sm btn-outline-secondary">
                <i class="icon-cog"></i>
              </button>


            </td>
              <th scope="row" :key="index" >{{index+1}}</th>
              <td v-for="data in document.data">{{data}}</td>
              
            </tr>

          </tbody>
        </table>        
      </div>
    </div>
        
  



  `,

})
