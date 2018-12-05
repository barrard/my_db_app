//TODO make file uploader for text documents and PDFs
const vue_img_uploader = Vue.component('img-uploader', {
  data: function () {
    return {

    };
  },
  props: {

  },
  mounted: function () {
    console.log('IMG UPLOADER MOUNTED')
  },
  computed:{
    collection_name(){
      return store.state.selected_collection.collection_name
    },
  },

  template: /*html*/ `
  <input id="file_input"  type="file"
    @change="init_file_upload">
`,
  methods: {


    init_file_upload($event) {
      // console.log($event.target)
      this.$emit('input', $event.target)
      this.handle_img_upload(
        $event.target.files,
        '/user/upload_files',
        (resp) => {
          // this.$emit('img_upload_complete')
          // this.img_processing_in_progress = false

          console.log('resp');
          console.log(resp);
          //this should be the uplaoded img name save don server
          //set it to the hidden input?
          store.commit('set_uploaded_file_name', resp.file_name)
          console.log(this)

      
        }
      );

    },


    handle_img_upload(files, url, cb) {
      // console.log('upload photo');

      if (window.File && window.FileReader && window.FileList && window.Blob) {
        var formData = new FormData();

        // console.log(files);
        var counter2 = 0;
        for (let counter = 0; counter < files.length; counter++) {
          // console.log(files[counter]);
          var data_sent = false;
          var
            dup_obj_preventer = {};
          this.setup_filereader(files[counter], (file) => {
            console.log('file')
            console.log(file)
            counter2++;

            if (!dup_obj_preventer[file.name]) {
              dup_obj_preventer[file.name] = true;
              formData.append('uploads[]', file);

              if (!data_sent) this.img_processing_progress = (counter2 / files.length * 100).toFixed(1)

              if (counter2 == files.length && !data_sent) {
                data_sent = true;


                this.upload_img(formData, url, cb);


              } else {
                console.error('dont send yet');
              }
            } else {
              console.error('ERROR');
            }
          });
        }
      } else {
        alert('The File APIs are not fully supported in this browser.');
      }
    },

    dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new
        Uint8Array(array)
      ], {
        type: 'image/jpeg',
      });
    },
    decrease_img_size(file, cb) {

      var reader = new FileReader();
      reader.onload = (e) => {
        this.reader_on_load(e, cb)
      }
      reader.readAsDataURL(file);
    },
    reader_on_load(e, cb) {
      console.log('file reader');
      const data = e.target.result;

      var canvas = document.createElement('canvas')
      var image = new Image();
      image.onload = () => {
        this.img_on_load(image, canvas, cb)
      }
      image.src = data;
    },
    img_on_load(image, canvas, cb) {
      // Resize the image
      var max_size = 277;
      var ctx = canvas.getContext('2d');

      // max_size = 277,// TODO : pull max size from a site config
      //max_size = 775,// TODO : pull max size from a site config
      var width = image.width
      var height = image.height
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
     canvas.toBlob(
        (blob) => {
          console.log('cb with blooob')
          console.log(blob)
          cb(blob);
        },
        'image/jpeg',
        0.5
      );


    },
    setup_filereader(file, cb) {
      if (!file) return cb('no file');
      // Ensure it's an image
      if (file.type.match(/image.*/)) {
        // console.log('An image has been loaded');
        if (file.size < 100000) {
          cb(file);
        } else {
          // console.log('DECREASE');
          this.decrease_img_size(file, (smaller_file) => {
            // console.log('make to CB');
            // console.log(smaller_file)
            cb(smaller_file);
          });
        }
      } else {
        toast({
          msg: 'That doesnt appear to be an image, try something with .png, .jpg, .jpeg etc...',
          type: 'error',
        });
      }
    },

    upload_img(formData, url, cb) {
      $.ajax({
        url: url,
        type: 'POST',
        beforeSend: function (request) {
          request.setRequestHeader('csrf-token', _csrf);
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (updated_photos_array) {
          // console.log('upload successful!');
          // console.log(updated_photos_array)
          cb(updated_photos_array);
          // edit_campaign_vue.crowdsale.photos = updated_photos_array
          toast({
            msg: 'File uploaded!',
            type: 'success'
          });
        },
        error: function (error) {
          console.log('error ' + error);
          for (var k in error) {
            // console.log(k + ' : ' + error[k])
          }
        },
        xhr: function () {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener(
            'progress',
            function (evt) {
              // console.log('progress');
              // console.log(evt);
              if (evt.lengthComputable) {
                // calculate the percentage of upload completed
                // var percentComplete = evt.loaded / evt.total;
                // percentComplete = parseInt(percentComplete * 100);
                // cb({percentComplete})

                // update the Bootstrap progress bar with the new percentage
                // $('.progress-bar').text(percentComplete + '%');
                // $('.progress-bar').width(percentComplete + '%');

                // once the upload reaches 100%, set the progress bar text to done
                // if (percentComplete === 100) {
                  // $('.progress-bar').html('Done');
                // }
              }
            },
            false
          );

          return xhr;
        },
      });
    },
  },
});