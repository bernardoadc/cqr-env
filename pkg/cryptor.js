const encryptor = require('simple-encryptor')
const fs = require('fs')


const safeSize = 'bZ8TfrbMAus7W2vF' // simple-encryptor requires at least 16 chars

function decrypt (file, envvar) {
  if (file.slice(-10) != '.encrypted') throw new Error(`${file} extension is not '.encrypted'`)

  const encrypted = Buffer.from(fs.readFileSync(file)).toString()
  const data = encryptor(process.env[envvar] + safeSize).decrypt(encrypted)
  if (!data) throw new Error('Failed to decrypt env file (wrong password?)')

  return Buffer.from(data).toString()
}

function encryptFiles (gloob, envvar) {
  for (const f of gloob) {
    if (f.slice(-8) != '.exposed') throw new Error(`${f} extension is not '.exposed'`)

    const data = fs.readFileSync(f)
    const encrypted = encryptor(process.env[envvar] + safeSize).encrypt(data)
    fs.writeFileSync(f.replace('.exposed', '.encrypted'), encrypted)
    fs.unlinkSync(f)
    console.log(`Encrypted file ${f} sucessfuly`)
  }
}

function decryptFiles (gloob, envvar) {
  for (const f of gloob) {
    if (f.slice(-10) != '.encrypted') throw new Error(`${f} extension is not '.encrypted'`)

    const encrypted = Buffer.from(fs.readFileSync(f)).toString()
    const data = Buffer.from(encryptor(process.env[envvar] + safeSize).decrypt(encrypted)).toString()
    fs.writeFileSync(f.replace('.encrypted', '.exposed'), data)
    fs.unlinkSync(f)
    console.log(`Decrypted file ${f} sucessfuly`)
  }
}


module.exports = {
  decrypt,
  encryptFiles,
  decryptFiles
}
