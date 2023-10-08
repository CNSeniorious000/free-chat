const fs = require('fs').promises

async function saveCl100kBaseJson() {
  const cl100k_base_path = require.resolve('tiktoken/encoders/cl100k_base.json')
  await fs.copyFile(cl100k_base_path, 'public/cl100k_base.json')
}

async function saveTiktokenBgWasm() {
  const tiktoken_bg_path = require.resolve('tiktoken/tiktoken_bg.wasm')
  await fs.copyFile(tiktoken_bg_path, 'public/tiktoken_bg.wasm')
}

function prepareAssets() {
  return Promise.all([
    process.env.PUBLIC_CL100K_BASE_JSON_URL || saveCl100kBaseJson(),
    process.env.PUBLIC_TIKTOKEN_BG_WASM_URL || saveTiktokenBgWasm(),
  ])
}

prepareAssets()
