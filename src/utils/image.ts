const fetchImage = async (url: string) => {
  var myHeaders = new Headers()
  myHeaders.append('Referer', 'localhost')

  var requestOptions: any = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }
  let data: any = ''
  await fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      data = result
      //   console.log(result)
    })
    .catch((error) => console.log('error', error))
  console.log(data)
  return data
}

export default fetchImage
