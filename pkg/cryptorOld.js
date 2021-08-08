const fileEncrypt = require('file-encrypt')
const fs = require('fs')


function cb2Promise (err) {
  return new Promise((resolve, reject) => {
    if (err) reject(err)
    resolve()
  })
}

function encrypt (gloob, envvar) {
  for (const f of gloob) {
    if (f.slice(-8) != '.exposed') throw new Error(`${f} extension is not '.exposed'`)

    fileEncrypt.encryptFile(f, f.replace('.exposed', '.encrypted'), process.env[envvar], 'aes-256-gcm', cb2Promise).then(() => {
      fs.unlinkSync(f)
      console.log(`Encrypted file ${f} sucessfuly`)
    }).catch(function (e) {
      console.log(e)
      throw new Error(e)
    })
  }
}

async function decrypt (gloob, envvar) {
  for (const f of gloob) {
    if (f.slice(-10) != '.encrypted') throw new Error(`${f} extension is not '.exposed'`)

    try {
      await fileEncrypt.decryptFile(f, f.replace('.encrypted', '.exposed'), process.env[envvar], 'aes-256-gcm', cb2Promise)
      fs.unlinkSync(f)
      console.log(`Decrypted file ${f} sucessfuly`)
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }
}


module.exports = {
  encrypt,
  decrypt
}
