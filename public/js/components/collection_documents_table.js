Vue.component('collections-documents-table', {
  data: function () {
    return {
      data_edit_mode:{},//used to toggle edit mode per row
      old_data:[]
    }
  },
  props: {

  },

  computed:{ 
    current_model(){
      return store.state.selected_collection.model

    },
    collection_documents(){
      return store.state.collection_documents

    },
    selected_collection(){
      return store.state.selected_collection
    },
    model_prop_names(){
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
    toggle_data_edit_mode(index){
      Vue.set(this.data_edit_mode, index,  !this.data_edit_mode[index])
      // this.data_edit_mode[index] = !this.data_edit_mode[index]
      console.log(`set to ${this.data_edit_mode[index]}`)
    },
    get_data_edit_mode(index){
      return this.data_edit_mode[index]
    }, 
    prop_type(index){
      let prop_obj = this.current_model[index]
      for(let key in prop_obj){
        return prop_obj[key]
      }

    },
    check_model(prop){
      console.log(prop)
      let model = this.selected_collection.model
      let prop_index = model.findIndex(prop_obj => {
        for(let prop_name in prop_obj){
          return prop_name == prop
        }
      });
      console.log(prop_index)
      if(prop_index < 0 ) return false
      return true
    },  
    async trash_document(index, document_id){
      try {
        console.log(index)
        // this.toggle_data_edit_mode(index)
        console.log(`Trash this document ${document_id}`)
      let resp = await $.post('/user/trash_document', {
        _csrf, document_id
      })
      if(resp.err)throw resp.err
      console.log(resp)
      toast({msg:'Trash Document', type:'success'})

      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:err, type:'error'})

      }

    },
    cancel_edit_data_mode(index){
      this.toggle_data_edit_mode(index)
      console.log(this.old_data[index])
      store.state.collection_documents[index].data = this.old_data[index]

    },
    edit_document(index){
        // console.log(index)
        let data  = store.state.collection_documents[index].data
        console.log(data)
        this.old_data[index]  = {...data}
        this.toggle_data_edit_mode(index)
      // console.log(`Edit this document ${document_id}`)

    },
    async save_edit_document(index, document_id){
    try {
      let colletion_id = store.state.collection_documents[index]._id
      let data = JSON.stringify(store.state.collection_documents[index].data)
      let resp = await $.post('/user/edit_document', {
          _csrf, document_id, data
        })
        if(resp.err)throw resp.err
        console.log(resp.new_user_collection_data)
        this.toggle_data_edit_mode(index)

        toast({msg:'Document Updated', type:'success'})
      } catch (err) {
        console.log('err'.bgRed)
        console.log(err)
        toast({msg:err, type:'error'})
      }
    }
    
  },

  template: /*html*/`
    <div v-if="selected_collection" class="container">
      <div class='row'>
        <table class="table">
          <thead>
            <tr>
              <th> </th>
              <th scope="col">#</th>
              <th v-for="prop_name in model_prop_names" scope="col">{{prop_name}}</th>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr v-for="(document, index) in collection_documents">
            ${/* Buttons to delete and edit  row data */''}

            <td  v-if="!data_edit_mode[index]"> 
              <button @click="trash_document(index, document._id)" type="button" class="btn btn-sm btn-outline-danger">
                <i class="icon-trash"></i>
              </button>
              <button @click="edit_document(index, document._id)" type="button" class="btn btn-sm btn-outline-secondary">
                <i class="icon-cog"></i>
              </button>
            </td>
            ${/* buttons ot save of cancel row data edit */''}

            <td  v-if="data_edit_mode[index]"> 
              <button 
                type="button" 
                @click="save_edit_document(index, document._id)"
                class="btn btn-sm btn-primary">
                SAVE <i class="ml-2 icon-save"></i>
              </button>
              <button 
                type="button" 
                @click="cancel_edit_data_mode(index)"
                class="btn btn-sm btn-secondary">
                CANCEL<i class="ml-2 icon-ban-circle"></i>
              </button>
            </td>
              <th scope="row" :key="index" >{{index+1}}</th>
              <template v-for="(prop_name, model_index) in model_prop_names">
                <td v-if="!data_edit_mode[index]">
                  {{document.data[prop_name]}}
                </td>
                  <edit-data-input v-else
                    :index="index"
                    :prop_type="prop_type(model_index)" 
                    :prop_name="prop_name"
                  >

              </template>


              
            </tr>

          </tbody>
        </table>        
      </div>
    </div>
        
  



  `,

})
