#!/usr/bin/env node
import * as fs from "node:fs"
import * as path from "node:path"
import * as https from "node:https"
import { argv } from "node:process"
import { execSync } from "node:child_process"

// @ts-ignore
export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  black: "\x1b[30m",
  normal: "\x1b[39m"
}
export const styles = {
  bold: "\x1b[1m",
  underline: "\x1b[4m",
  reverse: "\x1b[7m",
  normal: "\x1b[22m"
}
export const fn = func => func
export const imprt = fn(modulePath => {
  return import(modulePath)
})
export const nline = fn(() => console.log(""))
export const print = fn(msg => console.log(`${msg}`))
export const printc = fn((style, color, msg) =>
    console.log(`${style}${color}${msg}${colors.reset}`)
)
export const string = fn(value => {
  return value.toString()
})
const pcssUrl =
    "https://raw.githubusercontent.com/Thoq-jar/PCSS/master/.pcss/pcss.min.js"
const commands = ["version ", "about ", "info ", "help ", "new ", "update "]
const newUsage = `Usage: pcss new { project name }`

function getNpmVersion() {
  try {
    return (
        execSync("npm -v")
            .toString()
            .trim() + " npm"
    )
  } catch (error) {
    console.error("Error fetching npm version:", error)
    return "unknown"
  }
}

async function about() {
  const info = [
    "\n",
    "PerfectCSS CLI: v1.5.2",
    `Node: ${process.version}`,
    `Package manager: ${getNpmVersion()}`,
    `Arch: ${process.arch}`,
    `Platform: ${process.platform}`,
    "Help: ",
    `Enter one of these: ${commands.toString()}`,
    'Type "pcss version" to show this message'
  ]

  const logo = `
.______     ______     _______.     _______.     ______  __       __  
|   _  \\   /      |   /       |    /       |    /      ||  |     |  | 
|  |_)  | |  ,----'  |   (----\`   |   (----\`   |  ,----'|  |     |  | 
|   ___/  |  |        \\   \\        \\   \\       |  |     |  |     |  | 
|  |      |  \`----.----)   |   .----)   |      |  \`----.|  \`----.|  | 
| _|       \\______|_______/    |_______/        \\______||_______||__| 
`
  printc(styles.normal, colors.magenta, logo)
  info.forEach(sentence => printc(styles.normal, colors.blue, sentence))
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
        .get(url, response => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
            return
          }
          response.pipe(file)
          file.on("finish", () => {
            file.close(resolve)
          })
        })
        .on("error", err => {
          fs.unlink(dest, () => reject(err))
        })
  })
}

function createIndexHtml(filePath) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCSS Starter</title>
    <script src="./.pcss/pcss.min.js"></script>
</head>
<body>
    <h1>PCSS Starter template</h1>
</body>
</html>`
  fs.writeFileSync(filePath, htmlContent)
}

async function main() {
  const command = argv[2]
  const projectName = argv[3]

  if (
      command === "version" ||
      command === "about" ||
      command === "info" ||
      command === "help"
  ) {
    about().then(() => process.exit(0))
  } else if (command === "new" && !projectName) {
    printc(styles.bold, colors.red, newUsage)
    process.exit(1)
  } else if (command === 'update') {
    printc(styles.bold, colors.blue, 'Updating...');
    execSync('npm install -g pc-cli');
    printc(styles.bold, colors.green, 'Updated to the latest version!');
    process.exit(0)
  } else {
    printc(
        styles.bold,
        colors.red,
        `Unknown command/usage: ${command}, for help type "pcss help"`
    )
    process.exit(1)
  }

  const projectDir = path.join(__dirname, projectName)
  const pcssDir = path.join(projectDir, ".pcss")
  const pcssFilePath = path.join(pcssDir, "pcss.min.js")
  const indexHtmlPath = path.join(projectDir, "index.html")

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir)
  }
  if (!fs.existsSync(pcssDir)) {
    fs.mkdirSync(pcssDir)
  }
  try {
    await downloadFile(pcssUrl, pcssFilePath)
    createIndexHtml(indexHtmlPath)
    print(`Successfully initialized ${projectName}!`)
  } catch (error) {
    printc(styles.bold, colors.red, `Error: ${error}`)
  }
}

main().then(() => {})
