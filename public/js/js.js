function toast({msg, pos, type, time}){
  if(!msg || !type )return
  var message = msg
  var position = pos || 'north-east' //center west east south south-west south-east north north-west west north-east
  var timeout = time || 5000
  var type = type //success warning info error 
  nativeToast({
    message,position,timeout,type
  })

}