// $tore = new Vuex.Store({
//   state: {
//     selected_collection: null,
//     collections: collections,

//   },
//   mutations: {
//     edit_model_prop(state) {
//       console.log('state edit model prop')
//     },
//     async set_selected_collection(state, selected_collection) {
//       try {
//         console.log({state, selected_collection})
//         console.log('collection selcteed')
//         console.log('collection selcteed')
//         console.log('collection selcteed')
//         console.log('collection selcteed')
//         console.log('collection selcteed')
//         console.log('collection selcteed')
//         state.selected_collection = selected_collection
//         console.log(state.selected_collection)

//       } catch (err) {
//         console.log('err')
//         console.log(err)
//         toast({ msg: err, type: 'error' })
//       }
//     },
//   },

// })

$tore={
  user,
  update_password: '',
  confirm_password: '',
  new_collection_name: '',
  add_starter_model: 'yes',
  collections: collections,
  selected_collection: null,
  edit_mode: true,
  collection_documents:[]
}

