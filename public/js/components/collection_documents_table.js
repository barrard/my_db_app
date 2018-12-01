Vue.component('collections-documents-table', {
  data: function () {
    return {
    }
  },
  props: {
    collection_documents:Array,selected_collection:Object

  },

  computed:{
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
    trim(data){
      console.log(data)
      return data._id

    }
  },

  template: /*html*/`
    <div v-if="selected_collection" class="container">
      <div class='row justify-content-center'>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th v-for="key in model_keys" scope="col">{{key}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(document, index) in collection_documents">
              <th scope="row" :key="index" >{{index}}</th>
              <td v-for="data in document.data">{{data}}</td>
              
            </tr>

          </tbody>
        </table>        
      </div>
    </div>
        
  



  `,

})
