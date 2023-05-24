const appApi = process.env.APP_API
const appKey = process.env.APP_KEY

console.log('process.env.APP_TITLE', process.env.APP_TITLE)
console.log(`hello, ${process.env.APP_TITLE}`)

export function request(url, params) {
  if (process.env.APP_MODE === 'development') {
    console.log('request', url, params)
  }
  
  return fetch({
    url: `${appApi}/${url}`,
    headers: {
      'app-key': appKey
    },
    params
  })
}
