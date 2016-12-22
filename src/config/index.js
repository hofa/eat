module.exports = {
    'server': process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/'
  : 'http://192.168.64.2:3000/',
}
