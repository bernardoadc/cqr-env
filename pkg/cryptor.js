/* imports */
const encryptor = require('simple-encryptor')
const fs = require('fs')
/* lib */
const posix = require('./lib/posix')


const safeSize = 'bZ8TfrbMAus7W2vF' // simple-encryptor requires at least 16 chars


function getKey (medium, envvarOrPwfile) {
  switch (medium) {
    case 'var': return process.env[envvarOrPwfile] + safeSize
    case 'file': return Buffer.from(fs.readFileSync(posix(envvarOrPwfile))).toString() + safeSize
  }
}

function decrypt (file, medium, envvarOrPwfile) {
  if (file.slice(-10) != '.encrypted') throw new Error(`${file} extension is not '.encrypted'`)

  const encrypted = Buffer.from(fs.readFileSync(file)).toString()
  const data = encryptor(getKey(medium, envvarOrPwfile)).decrypt(encrypted)
  if (!data) throw new Error('Failed to decrypt env file (wrong password?)')

  return Buffer.from(data).toString()
}

function encryptFiles (gloob, medium, envvarOrPwfile) {
  for (const f of gloob) {
    const data = fs.readFileSync(f)
    const encrypted = encryptor(getKey(medium, envvarOrPwfile)).encrypt(data)
    fs.writeFileSync(f.replace('.exposed', '') + '.encrypted', encrypted)
    fs.unlinkSync(f)
    console.log(`Encrypted file ${f} sucessfuly`)
  }
}

function decryptFiles (gloob, medium, envvarOrPwfile) {
  for (const f of gloob) {
    if (f.slice(-10) != '.encrypted') throw new Error(`${f} extension is not '.encrypted'`)

    const encrypted = Buffer.from(fs.readFileSync(f)).toString()
    const data = Buffer.from(encryptor(getKey(medium, envvarOrPwfile)).decrypt(encrypted)).toString()
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
